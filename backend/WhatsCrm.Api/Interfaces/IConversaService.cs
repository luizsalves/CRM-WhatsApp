using WhatsCrm.Api.DTOs;
using WhatsCrm.Api.Entities;

namespace WhatsCrm.Api.Interfaces;

public interface IConversaService
{
    Task<PagedResult<ConversaResponse>> ListarAsync(StatusConversa? status, int pagina, int tamanhoPagina);
    Task<ConversaResponse> ObterPorIdAsync(Guid id);
    Task<PagedResult<MensagemResponse>> ListarMensagensAsync(Guid conversaId, int pagina, int tamanhoPagina);
    Task<MensagemResponse> EnviarMensagemAsync(Guid conversaId, EnviarMensagemRequest request);
    Task<ConversaResponse> AtualizarResponsavelAsync(Guid conversaId, AtualizarResponsavelRequest request);
    Task<ConversaResponse> AtualizarStatusAsync(Guid conversaId, AtualizarStatusConversaRequest request);
}
