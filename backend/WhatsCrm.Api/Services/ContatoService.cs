using Microsoft.EntityFrameworkCore;
using WhatsCrm.Api.Data;
using WhatsCrm.Api.DTOs;
using WhatsCrm.Api.Entities;
using WhatsCrm.Api.Exceptions;
using WhatsCrm.Api.Interfaces;

namespace WhatsCrm.Api.Services;

public class ContatoService : IContatoService
{
    private readonly AppDbContext _db;
    private readonly ICurrentUserService _currentUser;

    public ContatoService(AppDbContext db, ICurrentUserService currentUser)
    {
        _db = db;
        _currentUser = currentUser;
    }

    public async Task<PagedResult<ContatoResponse>> ListarAsync(string? busca, int pagina, int tamanhoPagina)
    {
        pagina = Math.Max(pagina, 1);
        tamanhoPagina = Math.Clamp(tamanhoPagina, 1, 100);

        var query = _db.Contatos
            .AsNoTracking()
            .Where(c => c.EmpresaId == _currentUser.EmpresaId);

        if (!string.IsNullOrWhiteSpace(busca))
        {
            var termo = busca.Trim();
            query = query.Where(c => EF.Functions.ILike(c.Nome, $"%{termo}%") || EF.Functions.ILike(c.Telefone, $"%{termo}%"));
        }

        var total = await query.CountAsync();

        var contatos = await query
            .Include(c => c.ContatoTags).ThenInclude(ct => ct.Tag)
            .OrderBy(c => c.Nome)
            .Skip((pagina - 1) * tamanhoPagina)
            .Take(tamanhoPagina)
            .ToListAsync();

        return new PagedResult<ContatoResponse>
        {
            Itens = contatos.Select(MapParaResponse).ToList(),
            Pagina = pagina,
            TamanhoPagina = tamanhoPagina,
            Total = total
        };
    }

    public async Task<ContatoResponse> ObterPorIdAsync(Guid id)
    {
        var contato = await BuscarContatoDaEmpresaAsync(id, incluirTags: true);
        return MapParaResponse(contato);
    }

    public async Task<ContatoResponse> CriarAsync(CreateContatoRequest request)
    {
        await GarantirTelefoneDisponivelAsync(request.Telefone, contatoIdIgnorado: null);

        var agora = DateTimeOffset.UtcNow;
        var contato = new Contato
        {
            Id = Guid.NewGuid(),
            EmpresaId = _currentUser.EmpresaId,
            Nome = request.Nome.Trim(),
            Telefone = request.Telefone.Trim(),
            Email = request.Email?.Trim(),
            DataNascimento = request.DataNascimento,
            EmpresaNome = request.EmpresaNome?.Trim(),
            Observacoes = request.Observacoes?.Trim(),
            ResponsavelUsuarioId = request.ResponsavelUsuarioId,
            CreatedAt = agora,
            UpdatedAt = agora
        };

        _db.Contatos.Add(contato);
        await _db.SaveChangesAsync();

        return MapParaResponse(contato);
    }

    public async Task<ContatoResponse> AtualizarAsync(Guid id, UpdateContatoRequest request)
    {
        var contato = await BuscarContatoDaEmpresaAsync(id, incluirTags: true);
        await GarantirTelefoneDisponivelAsync(request.Telefone, contatoIdIgnorado: id);

        contato.Nome = request.Nome.Trim();
        contato.Telefone = request.Telefone.Trim();
        contato.Email = request.Email?.Trim();
        contato.DataNascimento = request.DataNascimento;
        contato.EmpresaNome = request.EmpresaNome?.Trim();
        contato.Observacoes = request.Observacoes?.Trim();
        contato.ResponsavelUsuarioId = request.ResponsavelUsuarioId;
        contato.UpdatedAt = DateTimeOffset.UtcNow;

        await _db.SaveChangesAsync();

        return MapParaResponse(contato);
    }

    public async Task ExcluirAsync(Guid id)
    {
        var contato = await BuscarContatoDaEmpresaAsync(id, incluirTags: false);
        _db.Contatos.Remove(contato);
        await _db.SaveChangesAsync();
    }

    public async Task<ContatoResponse> AdicionarTagAsync(Guid contatoId, Guid tagId)
    {
        var contato = await BuscarContatoDaEmpresaAsync(contatoId, incluirTags: true);
        var tag = await BuscarTagDaEmpresaAsync(tagId);

        if (contato.ContatoTags.All(ct => ct.TagId != tag.Id))
        {
            _db.ContatoTags.Add(new ContatoTag { ContatoId = contato.Id, TagId = tag.Id });
            await _db.SaveChangesAsync();
        }

        return await ObterPorIdAsync(contatoId);
    }

    public async Task<ContatoResponse> RemoverTagAsync(Guid contatoId, Guid tagId)
    {
        var contato = await BuscarContatoDaEmpresaAsync(contatoId, incluirTags: true);
        var vinculo = contato.ContatoTags.FirstOrDefault(ct => ct.TagId == tagId);

        if (vinculo is not null)
        {
            _db.ContatoTags.Remove(vinculo);
            await _db.SaveChangesAsync();
        }

        return await ObterPorIdAsync(contatoId);
    }

    private async Task<Contato> BuscarContatoDaEmpresaAsync(Guid id, bool incluirTags)
    {
        var query = _db.Contatos.Where(c => c.Id == id && c.EmpresaId == _currentUser.EmpresaId);

        if (incluirTags)
        {
            query = query.Include(c => c.ContatoTags).ThenInclude(ct => ct.Tag);
        }

        var contato = await query.FirstOrDefaultAsync();
        return contato ?? throw new NotFoundAppException("Contato não encontrado.");
    }

    private async Task<Tag> BuscarTagDaEmpresaAsync(Guid id)
    {
        var tag = await _db.Tags.FirstOrDefaultAsync(t => t.Id == id && t.EmpresaId == _currentUser.EmpresaId);
        return tag ?? throw new NotFoundAppException("Tag não encontrada.");
    }

    private async Task GarantirTelefoneDisponivelAsync(string telefone, Guid? contatoIdIgnorado)
    {
        var telefoneNormalizado = telefone.Trim();
        var existe = await _db.Contatos.AsNoTracking().AnyAsync(c =>
            c.EmpresaId == _currentUser.EmpresaId &&
            c.Telefone == telefoneNormalizado &&
            c.Id != (contatoIdIgnorado ?? Guid.Empty));

        if (existe)
        {
            throw new ConflictAppException("Já existe um contato com este telefone nesta empresa.");
        }
    }

    private static ContatoResponse MapParaResponse(Contato contato) => new()
    {
        Id = contato.Id,
        Nome = contato.Nome,
        Telefone = contato.Telefone,
        Email = contato.Email,
        DataNascimento = contato.DataNascimento,
        EmpresaNome = contato.EmpresaNome,
        Observacoes = contato.Observacoes,
        ResponsavelUsuarioId = contato.ResponsavelUsuarioId,
        CreatedAt = contato.CreatedAt,
        Tags = contato.ContatoTags
            .Select(ct => new TagResponse { Id = ct.Tag.Id, Nome = ct.Tag.Nome, Cor = ct.Tag.Cor })
            .OrderBy(t => t.Nome)
            .ToList()
    };
}
