using WhatsCrm.Api.DTOs;

namespace WhatsCrm.Api.Interfaces;

public interface IContatoService
{
    Task<PagedResult<ContatoResponse>> ListarAsync(string? busca, int pagina, int tamanhoPagina);
    Task<ContatoResponse> ObterPorIdAsync(Guid id);
    Task<ContatoResponse> CriarAsync(CreateContatoRequest request);
    Task<ContatoResponse> AtualizarAsync(Guid id, UpdateContatoRequest request);
    Task ExcluirAsync(Guid id);
    Task<ContatoResponse> AdicionarTagAsync(Guid contatoId, Guid tagId);
    Task<ContatoResponse> RemoverTagAsync(Guid contatoId, Guid tagId);
}
