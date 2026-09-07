using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using WhatsCrm.Api.Data;
using WhatsCrm.Api.Entities;
using WhatsCrm.Api.Extensions;
using WhatsCrm.Api.Integrations.WhatsApp;
using WhatsCrm.Api.Interfaces;

namespace WhatsCrm.Api.Controllers;

/// <summary>
/// Endpoints públicos chamados pela Meta (WhatsApp Cloud API) — não usam JWT.
/// A segurança vem da validação do hub.verify_token (GET) e da assinatura HMAC (POST).
/// </summary>
[ApiController]
[Route("api/webhooks/whatsapp")]
public class WebhooksController : ControllerBase
{
    private readonly WhatsAppSettings _settings;
    private readonly IWebhookSignatureValidator _signatureValidator;
    private readonly IWebhookProcessingService _webhookProcessingService;
    private readonly AppDbContext _db;
    private readonly ILogger<WebhooksController> _logger;

    public WebhooksController(
        IOptions<WhatsAppSettings> settings,
        IWebhookSignatureValidator signatureValidator,
        IWebhookProcessingService webhookProcessingService,
        AppDbContext db,
        ILogger<WebhooksController> logger)
    {
        _settings = settings.Value;
        _signatureValidator = signatureValidator;
        _webhookProcessingService = webhookProcessingService;
        _db = db;
        _logger = logger;
    }

    [HttpGet]
    public IActionResult Verificar(
        [FromQuery(Name = "hub.mode")] string? modo,
        [FromQuery(Name = "hub.verify_token")] string? tokenRecebido,
        [FromQuery(Name = "hub.challenge")] string? challenge)
    {
        if (modo == "subscribe" && !string.IsNullOrEmpty(_settings.VerifyToken) && tokenRecebido == _settings.VerifyToken)
        {
            return Content(challenge ?? string.Empty, "text/plain");
        }

        return Forbid();
    }

    [HttpPost]
    public async Task<IActionResult> Receber()
    {
        Request.EnableBuffering();
        using var leitor = new StreamReader(Request.Body, leaveOpen: true);
        var corpoBruto = await leitor.ReadToEndAsync();
        Request.Body.Position = 0;

        var assinatura = Request.Headers["X-Hub-Signature-256"].FirstOrDefault();
        if (!_signatureValidator.AssinaturaValida(corpoBruto, assinatura))
        {
            _logger.LogWarning("Webhook do WhatsApp recebido com assinatura inválida.");
            return Unauthorized();
        }

        var idsDoEvento = ExtrairIdsDeEvento(corpoBruto);
        if (idsDoEvento.Count == 0)
        {
            return Ok();
        }

        var idsJaProcessados = await _db.WebhookEventos
            .Where(w => idsDoEvento.Contains(w.ProviderEventId))
            .Select(w => w.ProviderEventId)
            .ToListAsync();

        var idsNovos = idsDoEvento.Except(idsJaProcessados).ToList();
        if (idsNovos.Count == 0)
        {
            return Ok();
        }

        var (empresaId, whatsappContaId) = await ResolverEmpresaAsync(corpoBruto);
        var agora = DateTimeOffset.UtcNow;

        foreach (var idNovo in idsNovos)
        {
            _db.WebhookEventos.Add(new WebhookEvento
            {
                Id = Guid.NewGuid(),
                EmpresaId = empresaId,
                WhatsappContaId = whatsappContaId,
                ProviderEventId = idNovo,
                Tipo = TipoWebhookEvento.MENSAGEM,
                Payload = corpoBruto,
                Processado = false,
                CreatedAt = agora
            });
        }

        await _db.SaveChangesAsync();

        await _webhookProcessingService.ProcessarAsync(corpoBruto);

        await _db.WebhookEventos
            .Where(w => idsNovos.Contains(w.ProviderEventId))
            .ExecuteUpdateAsync(setters => setters
                .SetProperty(w => w.Processado, true)
                .SetProperty(w => w.ProcessedAt, DateTimeOffset.UtcNow));

        return Ok();
    }

    private static List<string> ExtrairIdsDeEvento(string corpoBruto)
    {
        var ids = new List<string>();

        try
        {
            var payload = JsonSerializer.Deserialize<WhatsAppWebhookPayload>(corpoBruto);
            foreach (var change in payload?.Entry?.SelectMany(e => e.Changes ?? Enumerable.Empty<WebhookChange>()) ?? Enumerable.Empty<WebhookChange>())
            {
                foreach (var mensagem in change.Value?.Messages ?? Enumerable.Empty<WebhookMessage>())
                {
                    if (!string.IsNullOrEmpty(mensagem.Id))
                    {
                        ids.Add(mensagem.Id);
                    }
                }

                foreach (var status in change.Value?.Statuses ?? Enumerable.Empty<WebhookStatus>())
                {
                    if (!string.IsNullOrEmpty(status.Id) && !string.IsNullOrEmpty(status.Status))
                    {
                        ids.Add($"{status.Id}:{status.Status}");
                    }
                }
            }
        }
        catch (JsonException)
        {
            // payload malformado — nada a extrair, será ignorado pelo chamador.
        }

        return ids;
    }

    private async Task<(Guid? EmpresaId, Guid? WhatsappContaId)> ResolverEmpresaAsync(string corpoBruto)
    {
        try
        {
            var payload = JsonSerializer.Deserialize<WhatsAppWebhookPayload>(corpoBruto);
            var phoneNumberId = payload?.Entry?
                .SelectMany(e => e.Changes ?? Enumerable.Empty<WebhookChange>())
                .Select(c => c.Value?.Metadata?.PhoneNumberId)
                .FirstOrDefault(id => !string.IsNullOrEmpty(id));

            if (string.IsNullOrEmpty(phoneNumberId))
            {
                return (null, null);
            }

            var conta = await _db.WhatsappContas.AsNoTracking()
                .FirstOrDefaultAsync(w => w.PhoneNumberId == phoneNumberId);

            return conta is null ? (null, null) : (conta.EmpresaId, conta.Id);
        }
        catch (JsonException)
        {
            return (null, null);
        }
    }
}
