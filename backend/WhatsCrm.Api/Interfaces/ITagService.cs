using WhatsCrm.Api.DTOs;

namespace WhatsCrm.Api.Interfaces;

public interface ITagService
{
    Task<IReadOnlyList<TagResponse>> ListarAsync();
    Task<TagResponse> CriarAsync(CreateTagRequest request);
    Task<TagResponse> AtualizarAsync(Guid id, UpdateTagRequest request);
    Task ExcluirAsync(Guid id);
}
