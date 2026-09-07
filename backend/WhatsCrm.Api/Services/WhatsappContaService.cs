using Microsoft.AspNetCore.DataProtection;
using Microsoft.EntityFrameworkCore;
using WhatsCrm.Api.Data;
using WhatsCrm.Api.DTOs;
using WhatsCrm.Api.Entities;
using WhatsCrm.Api.Exceptions;
using WhatsCrm.Api.Interfaces;

namespace WhatsCrm.Api.Services;

public class WhatsappContaService : IWhatsappContaService
{
    private const string PropositoProtecao = "WhatsCrm.WhatsappAccessToken.v1";

    private readonly AppDbContext _db;
    private readonly ICurrentUserService _currentUser;
    private readonly IDataProtector _protector;

    public WhatsappContaService(AppDbContext db, ICurrentUserService currentUser, IDataProtectionProvider dataProtectionProvider)
    {
        _db = db;
        _currentUser = currentUser;
        _protector = dataProtectionProvider.CreateProtector(PropositoProtecao);
    }

    public async Task<WhatsappContaResponse?> ObterDaEmpresaAtualAsync()
    {
        var conta = await _db.WhatsappContas
            .AsNoTracking()
            .Where(w => w.EmpresaId == _currentUser.EmpresaId && w.Ativo)
            .OrderByDescending(w => w.CreatedAt)
            .FirstOrDefaultAsync();

        return conta is null ? null : MapParaResponse(conta);
    }

    public async Task<WhatsappContaResponse> SalvarAsync(CreateWhatsappContaRequest request)
    {
        var phoneNumberId = request.PhoneNumberId.Trim();

        var jaExisteEmOutraEmpresa = await _db.WhatsappContas.AsNoTracking()
            .AnyAsync(w => w.PhoneNumberId == phoneNumberId && w.EmpresaId != _currentUser.EmpresaId);

        if (jaExisteEmOutraEmpresa)
        {
            throw new ConflictAppException("Este número (Phone Number ID) já está conectado a outra empresa.");
        }

        var contaExistente = await _db.WhatsappContas
            .FirstOrDefaultAsync(w => w.EmpresaId == _currentUser.EmpresaId && w.PhoneNumberId == phoneNumberId);

        var agora = DateTimeOffset.UtcNow;
        var tokenCriptografado = _protector.Protect(request.AccessToken);

        if (contaExistente is not null)
        {
            contaExistente.WabaId = request.WabaId.Trim();
            contaExistente.NumeroExibicao = request.NumeroExibicao.Trim();
            contaExistente.AccessTokenCriptografado = tokenCriptografado;
            contaExistente.Ativo = true;
            contaExistente.UpdatedAt = agora;

            await _db.SaveChangesAsync();
            return MapParaResponse(contaExistente);
        }

        var conta = new WhatsappConta
        {
            Id = Guid.NewGuid(),
            EmpresaId = _currentUser.EmpresaId,
            PhoneNumberId = phoneNumberId,
            WabaId = request.WabaId.Trim(),
            NumeroExibicao = request.NumeroExibicao.Trim(),
            AccessTokenCriptografado = tokenCriptografado,
            Ativo = true,
            CreatedAt = agora,
            UpdatedAt = agora
        };

        _db.WhatsappContas.Add(conta);
        await _db.SaveChangesAsync();

        return MapParaResponse(conta);
    }

    public async Task DesativarAsync(Guid id)
    {
        var conta = await _db.WhatsappContas
            .FirstOrDefaultAsync(w => w.Id == id && w.EmpresaId == _currentUser.EmpresaId);

        if (conta is null)
        {
            throw new NotFoundAppException("Conta do WhatsApp não encontrada.");
        }

        conta.Ativo = false;
        conta.UpdatedAt = DateTimeOffset.UtcNow;
        await _db.SaveChangesAsync();
    }

    public async Task<(WhatsappConta Conta, string AccessToken)?> ResolverPorPhoneNumberIdAsync(string phoneNumberId)
    {
        var conta = await _db.WhatsappContas
            .FirstOrDefaultAsync(w => w.PhoneNumberId == phoneNumberId && w.Ativo);

        if (conta is null)
        {
            return null;
        }

        var accessToken = _protector.Unprotect(conta.AccessTokenCriptografado);
        return (conta, accessToken);
    }

    private static WhatsappContaResponse MapParaResponse(WhatsappConta conta) => new()
    {
        Id = conta.Id,
        PhoneNumberId = conta.PhoneNumberId,
        WabaId = conta.WabaId,
        NumeroExibicao = conta.NumeroExibicao,
        Ativo = conta.Ativo,
        CreatedAt = conta.CreatedAt
    };
}
