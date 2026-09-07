using System.Globalization;
using System.Text.Json;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using WhatsCrm.Api.Data;
using WhatsCrm.Api.DTOs;
using WhatsCrm.Api.Entities;
using WhatsCrm.Api.Hubs;
using WhatsCrm.Api.Integrations.WhatsApp;
using WhatsCrm.Api.Interfaces;

namespace WhatsCrm.Api.Services;

public class WebhookProcessingService : IWebhookProcessingService
{
    private readonly AppDbContext _db;
    private readonly IHubContext<ConversationsHub> _hubContext;
    private readonly ILogger<WebhookProcessingService> _logger;

    public WebhookProcessingService(AppDbContext db, IHubContext<ConversationsHub> hubContext, ILogger<WebhookProcessingService> logger)
    {
        _db = db;
        _hubContext = hubContext;
        _logger = logger;
    }

    public async Task ProcessarAsync(string payloadJson)
    {
        var payload = JsonSerializer.Deserialize<WhatsAppWebhookPayload>(payloadJson);
        if (payload?.Entry is null)
        {
            return;
        }

        foreach (var entry in payload.Entry)
        {
            foreach (var change in entry.Changes ?? Enumerable.Empty<WebhookChange>())
            {
                var value = change.Value;
                var phoneNumberId = value?.Metadata?.PhoneNumberId;
                if (value is null || string.IsNullOrEmpty(phoneNumberId))
                {
                    continue;
                }

                var whatsappConta = await _db.WhatsappContas
                    .FirstOrDefaultAsync(w => w.PhoneNumberId == phoneNumberId && w.Ativo);

                if (whatsappConta is null)
                {
                    _logger.LogWarning("Webhook recebido para phone_number_id {PhoneNumberId} sem WhatsappConta correspondente.", phoneNumberId);
                    continue;
                }

                foreach (var mensagemRecebida in value.Messages ?? Enumerable.Empty<WebhookMessage>())
                {
                    await ProcessarMensagemRecebidaAsync(whatsappConta, value, mensagemRecebida);
                }

                foreach (var status in value.Statuses ?? Enumerable.Empty<WebhookStatus>())
                {
                    await ProcessarStatusAsync(status);
                }
            }
        }
    }

    private async Task ProcessarMensagemRecebidaAsync(WhatsappConta whatsappConta, WebhookValue value, WebhookMessage mensagemRecebida)
    {
        if (string.IsNullOrEmpty(mensagemRecebida.From) || string.IsNullOrEmpty(mensagemRecebida.Id))
        {
            return;
        }

        var jaExiste = await _db.Mensagens.AsNoTracking()
            .AnyAsync(m => m.ProviderMessageId == mensagemRecebida.Id);
        if (jaExiste)
        {
            return;
        }

        var telefone = "+" + mensagemRecebida.From;
        var nomePerfil = value.Contacts?.FirstOrDefault(c => c.WaId == mensagemRecebida.From)?.Profile?.Name;
        var agora = DateTimeOffset.UtcNow;

        var contato = await _db.Contatos
            .FirstOrDefaultAsync(c => c.EmpresaId == whatsappConta.EmpresaId && c.Telefone == telefone);

        if (contato is null)
        {
            contato = new Contato
            {
                Id = Guid.NewGuid(),
                EmpresaId = whatsappConta.EmpresaId,
                Nome = string.IsNullOrWhiteSpace(nomePerfil) ? telefone : nomePerfil,
                Telefone = telefone,
                CreatedAt = agora,
                UpdatedAt = agora
            };
            _db.Contatos.Add(contato);
        }

        var conversa = await _db.Conversas
            .FirstOrDefaultAsync(c => c.ContatoId == contato.Id && c.WhatsappContaId == whatsappConta.Id);

        var textoMensagem = mensagemRecebida.Type == "text" ? mensagemRecebida.Text?.Body : $"[{mensagemRecebida.Type}]";
        var recebidaEm = ConverterTimestamp(mensagemRecebida.Timestamp) ?? agora;

        if (conversa is null)
        {
            conversa = new Conversa
            {
                Id = Guid.NewGuid(),
                EmpresaId = whatsappConta.EmpresaId,
                ContatoId = contato.Id,
                WhatsappContaId = whatsappConta.Id,
                Status = StatusConversa.ABERTA,
                UltimaMensagemEm = recebidaEm,
                UltimaMensagemTexto = textoMensagem,
                QuantidadeNaoLidas = 1,
                CreatedAt = agora,
                UpdatedAt = agora
            };
            _db.Conversas.Add(conversa);
        }
        else
        {
            conversa.UltimaMensagemEm = recebidaEm;
            conversa.UltimaMensagemTexto = textoMensagem;
            conversa.QuantidadeNaoLidas++;
            conversa.UpdatedAt = agora;
            if (conversa.Status == StatusConversa.RESOLVIDA)
            {
                conversa.Status = StatusConversa.ABERTA;
            }
        }

        var mensagem = new Mensagem
        {
            Id = Guid.NewGuid(),
            EmpresaId = whatsappConta.EmpresaId,
            ConversaId = conversa.Id,
            ProviderMessageId = mensagemRecebida.Id,
            Direcao = DirecaoMensagem.ENTRADA,
            Tipo = MapearTipo(mensagemRecebida.Type),
            Texto = textoMensagem,
            Status = StatusMensagem.RECEBIDA,
            RecebidaEm = recebidaEm,
            CreatedAt = agora
        };

        _db.Mensagens.Add(mensagem);
        await _db.SaveChangesAsync();

        await _hubContext.Clients.Group(ConversationsHub.GrupoDaEmpresa(whatsappConta.EmpresaId))
            .SendAsync("novaMensagem", new
            {
                conversaId = conversa.Id,
                mensagem = MapMensagem(mensagem)
            });
    }

    private async Task ProcessarStatusAsync(WebhookStatus status)
    {
        if (string.IsNullOrEmpty(status.Id) || string.IsNullOrEmpty(status.Status))
        {
            return;
        }

        var mensagem = await _db.Mensagens.FirstOrDefaultAsync(m => m.ProviderMessageId == status.Id);
        if (mensagem is null)
        {
            return;
        }

        var novoStatus = status.Status.ToUpperInvariant() switch
        {
            "SENT" => StatusMensagem.ENVIADA,
            "DELIVERED" => StatusMensagem.ENTREGUE,
            "READ" => StatusMensagem.LIDA,
            "FAILED" => StatusMensagem.FALHOU,
            _ => (StatusMensagem?)null
        };

        if (novoStatus is null)
        {
            return;
        }

        mensagem.Status = novoStatus.Value;
        if (novoStatus == StatusMensagem.LIDA)
        {
            mensagem.LidaEm = ConverterTimestamp(status.Timestamp) ?? DateTimeOffset.UtcNow;
        }

        await _db.SaveChangesAsync();
    }

    private static TipoMensagem MapearTipo(string? tipo) => tipo switch
    {
        "text" => TipoMensagem.TEXTO,
        "image" => TipoMensagem.IMAGEM,
        "document" => TipoMensagem.DOCUMENTO,
        "audio" => TipoMensagem.AUDIO,
        "video" => TipoMensagem.VIDEO,
        "location" => TipoMensagem.LOCALIZACAO,
        _ => TipoMensagem.TEXTO
    };

    private static DateTimeOffset? ConverterTimestamp(string? timestampUnix)
    {
        if (string.IsNullOrEmpty(timestampUnix) || !long.TryParse(timestampUnix, NumberStyles.Integer, CultureInfo.InvariantCulture, out var segundos))
        {
            return null;
        }

        return DateTimeOffset.FromUnixTimeSeconds(segundos);
    }

    private static MensagemResponse MapMensagem(Mensagem mensagem) => new()
    {
        Id = mensagem.Id,
        ConversaId = mensagem.ConversaId,
        Direcao = mensagem.Direcao,
        Tipo = mensagem.Tipo,
        Texto = mensagem.Texto,
        Status = mensagem.Status,
        EnviadaEm = mensagem.EnviadaEm,
        RecebidaEm = mensagem.RecebidaEm,
        CreatedAt = mensagem.CreatedAt
    };
}
