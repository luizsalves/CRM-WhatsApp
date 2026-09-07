using Microsoft.EntityFrameworkCore;
using WhatsCrm.Api.Data;
using WhatsCrm.Api.DTOs;
using WhatsCrm.Api.Entities;
using WhatsCrm.Api.Exceptions;
using WhatsCrm.Api.Interfaces;

namespace WhatsCrm.Api.Services;

public class TagService : ITagService
{
    private readonly AppDbContext _db;
    private readonly ICurrentUserService _currentUser;

    public TagService(AppDbContext db, ICurrentUserService currentUser)
    {
        _db = db;
        _currentUser = currentUser;
    }

    public async Task<IReadOnlyList<TagResponse>> ListarAsync()
    {
        return await _db.Tags
            .AsNoTracking()
            .Where(t => t.EmpresaId == _currentUser.EmpresaId)
            .OrderBy(t => t.Nome)
            .Select(t => new TagResponse { Id = t.Id, Nome = t.Nome, Cor = t.Cor })
            .ToListAsync();
    }

    public async Task<TagResponse> CriarAsync(CreateTagRequest request)
    {
        await GarantirNomeDisponivelAsync(request.Nome, tagIdIgnorada: null);

        var tag = new Tag
        {
            Id = Guid.NewGuid(),
            EmpresaId = _currentUser.EmpresaId,
            Nome = request.Nome.Trim(),
            Cor = request.Cor,
            CreatedAt = DateTimeOffset.UtcNow
        };

        _db.Tags.Add(tag);
        await _db.SaveChangesAsync();

        return new TagResponse { Id = tag.Id, Nome = tag.Nome, Cor = tag.Cor };
    }

    public async Task<TagResponse> AtualizarAsync(Guid id, UpdateTagRequest request)
    {
        var tag = await BuscarTagDaEmpresaAsync(id);
        await GarantirNomeDisponivelAsync(request.Nome, tagIdIgnorada: id);

        tag.Nome = request.Nome.Trim();
        tag.Cor = request.Cor;
        await _db.SaveChangesAsync();

        return new TagResponse { Id = tag.Id, Nome = tag.Nome, Cor = tag.Cor };
    }

    public async Task ExcluirAsync(Guid id)
    {
        var tag = await BuscarTagDaEmpresaAsync(id);
        _db.Tags.Remove(tag);
        await _db.SaveChangesAsync();
    }

    private async Task<Tag> BuscarTagDaEmpresaAsync(Guid id)
    {
        var tag = await _db.Tags.FirstOrDefaultAsync(t => t.Id == id && t.EmpresaId == _currentUser.EmpresaId);
        return tag ?? throw new NotFoundAppException("Tag não encontrada.");
    }

    private async Task GarantirNomeDisponivelAsync(string nome, Guid? tagIdIgnorada)
    {
        var nomeNormalizado = nome.Trim();
        var existe = await _db.Tags.AsNoTracking().AnyAsync(t =>
            t.EmpresaId == _currentUser.EmpresaId &&
            t.Nome == nomeNormalizado &&
            t.Id != (tagIdIgnorada ?? Guid.Empty));

        if (existe)
        {
            throw new ConflictAppException("Já existe uma tag com este nome nesta empresa.");
        }
    }
}
