using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using WhatsCrm.Api.Data;
using WhatsCrm.Api.DTOs;
using WhatsCrm.Api.Entities;
using WhatsCrm.Api.Exceptions;
using WhatsCrm.Api.Hubs;
using WhatsCrm.Api.Interfaces;

namespace WhatsCrm.Api.Services;

public class ConversaService : IConversaService
{
    private readonly AppDbContext _db;
    private readonly ICurrentUserService _currentUser;
    private readonly IWhatsappContaService _whatsappContaService;
    private readonly IWhatsAppCloudApiClient _whatsAppCloudApiClient;
    private readonly IHubContext<ConversationsHub> _hubContext;

    public ConversaService(
        AppDbContext db,
        ICurrentUserService currentUser,
        IWhatsappContaService whatsappContaService,
        IWhatsAppCloudApiClient whatsAppCloudApiClient,
        IHubContext<ConversationsHub> hubContext)
    {
        _db = db;
        _currentUser = currentUser;
        _whatsappContaService = whatsappContaService;
        _whatsAppCloudApiClient = whatsAppCloudApiClient;
        _hubContext = hubContext;
    }

    public async Task<PagedResult<ConversaResponse>> ListarAsync(StatusConversa? status, int pagina, int tamanhoPagina)
    {
        pagina = Math.Max(pagina, 1);
        tamanhoPagina = Math.Clamp(tamanhoPagina, 1, 100);

        var query = _db.Conversas
            .AsNoTracking()
            .Include(c => c.Contato)
            .Where(c => c.EmpresaId == _currentUser.EmpresaId);

        if (status is not null)
        {
            query = query.Where(c => c.Status == status);
        }

        var total = await query.CountAsync();

        var conversas = await query
            .OrderByDescending(c => c.UltimaMensagemEm)
            .Skip((pagina - 1) * tamanhoPagina)
            .Take(tamanhoPagina)
            .ToListAsync();

        return new PagedResult<ConversaResponse>
        {
            Itens = conversas.Select(MapConversa).ToList(),
            Pagina = pagina,
            TamanhoPagina = tamanhoPagina,
            Total = total
        };
    }

    public async Task<ConversaResponse> ObterPorIdAsync(Guid id)
    {
        var conversa = await BuscarConversaDaEmpresaAsync(id);
        return MapConversa(conversa);
    }

    public async Task<PagedResult<MensagemResponse>> ListarMensagensAsync(Guid conversaId, int pagina, int tamanhoPagina)
    {
        var conversa = await BuscarConversaDaEmpresaAsync(conversaId);

        pagina = Math.Max(pagina, 1);
        tamanhoPagina = Math.Clamp(tamanhoPagina, 1, 200);

        var query = _db.Mensagens.AsNoTracking().Where(m => m.ConversaId == conversa.Id);
        var total = await query.CountAsync();

        var mensagens = await query
            .OrderByDescending(m => m.CreatedAt)
            .Skip((pagina - 1) * tamanhoPagina)
            .Take(tamanhoPagina)
            .ToListAsync();

        mensagens.Reverse();

        if (conversa.QuantidadeNaoLidas > 0)
        {
            conversa.QuantidadeNaoLidas = 0;
            await _db.SaveChangesAsync();
        }

        return new PagedResult<MensagemResponse>
        {
            Itens = mensagens.Select(MapMensagem).ToList(),
            Pagina = pagina,
            TamanhoPagina = tamanhoPagina,
            Total = total
        };
    }

    public async Task<MensagemResponse> EnviarMensagemAsync(Guid conversaId, EnviarMensagemRequest request)
    {
        var conversa = await BuscarConversaDaEmpresaAsync(conversaId);
        var contaResolvida = await _whatsappContaService.ResolverPorPhoneNumberIdAsync(
            (await _db.WhatsappContas.AsNoTracking().Where(w => w.Id == conversa.WhatsappContaId).Select(w => w.PhoneNumberId).FirstAsync()));

        if (contaResolvida is null)
        {
            throw new NotFoundAppException("A conta do WhatsApp desta conversa não está mais disponível.");
        }

        var telefoneDestino = (await _db.Contatos.AsNoTracking().Where(c => c.Id == conversa.ContatoId).Select(c => c.Telefone).FirstAsync())
            .TrimStart('+');

        var agora = DateTimeOffset.UtcNow;
        var mensagem = new Mensagem
        {
            Id = Guid.NewGuid(),
            EmpresaId = _currentUser.EmpresaId,
            ConversaId = conversa.Id,
            Direcao = DirecaoMensagem.SAIDA,
            Tipo = TipoMensagem.TEXTO,
            Texto = request.Texto,
            Status = StatusMensagem.ENVIANDO,
            CreatedAt = agora
        };

        _db.Mensagens.Add(mensagem);
        await _db.SaveChangesAsync();

        try
        {
            var providerMessageId = await _whatsAppCloudApiClient.EnviarTextoAsync(
                contaResolvida.Value.Conta.PhoneNumberId, contaResolvida.Value.AccessToken, telefoneDestino, request.Texto);

            mensagem.Status = StatusMensagem.ENVIADA;
            mensagem.ProviderMessageId = providerMessageId;
            mensagem.EnviadaEm = DateTimeOffset.UtcNow;

            // A prévia da conversa só reflete a mensagem depois de confirmado o envio —
            // uma falha não deve fazer parecer que aquela foi a última mensagem trocada.
            conversa.UltimaMensagemEm = agora;
            conversa.UltimaMensagemTexto = request.Texto;
            conversa.UpdatedAt = agora;
        }
        catch (WhatsAppApiException)
        {
            mensagem.Status = StatusMensagem.FALHOU;
            await _db.SaveChangesAsync();
            throw;
        }

        await _db.SaveChangesAsync();

        await _hubContext.Clients.Group(ConversationsHub.GrupoDaEmpresa(_currentUser.EmpresaId))
            .SendAsync("novaMensagem", new { conversaId = conversa.Id, mensagem = MapMensagem(mensagem) });

        return MapMensagem(mensagem);
    }

    public async Task<ConversaResponse> AtualizarResponsavelAsync(Guid conversaId, AtualizarResponsavelRequest request)
    {
        var conversa = await BuscarConversaDaEmpresaAsync(conversaId);
        conversa.ResponsavelUsuarioId = request.ResponsavelUsuarioId;
        conversa.UpdatedAt = DateTimeOffset.UtcNow;
        await _db.SaveChangesAsync();
        return MapConversa(conversa);
    }

    public async Task<ConversaResponse> AtualizarStatusAsync(Guid conversaId, AtualizarStatusConversaRequest request)
    {
        var conversa = await BuscarConversaDaEmpresaAsync(conversaId);
        conversa.Status = request.Status;
        conversa.UpdatedAt = DateTimeOffset.UtcNow;
        await _db.SaveChangesAsync();
        return MapConversa(conversa);
    }

    private async Task<Conversa> BuscarConversaDaEmpresaAsync(Guid id)
    {
        var conversa = await _db.Conversas
            .Include(c => c.Contato)
            .FirstOrDefaultAsync(c => c.Id == id && c.EmpresaId == _currentUser.EmpresaId);

        return conversa ?? throw new NotFoundAppException("Conversa não encontrada.");
    }

    private static ConversaResponse MapConversa(Conversa conversa) => new()
    {
        Id = conversa.Id,
        Contato = new ContatoResumoResponse
        {
            Id = conversa.Contato.Id,
            Nome = conversa.Contato.Nome,
            Telefone = conversa.Contato.Telefone
        },
        ResponsavelUsuarioId = conversa.ResponsavelUsuarioId,
        Status = conversa.Status,
        UltimaMensagemEm = conversa.UltimaMensagemEm,
        UltimaMensagemTexto = conversa.UltimaMensagemTexto,
        QuantidadeNaoLidas = conversa.QuantidadeNaoLidas
    };

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
