using Microsoft.EntityFrameworkCore;
using WhatsCrm.Api.Data;
using WhatsCrm.Api.DTOs;
using WhatsCrm.Api.Entities;
using WhatsCrm.Api.Exceptions;
using WhatsCrm.Api.Interfaces;

namespace WhatsCrm.Api.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _db;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly ICurrentUserService _currentUser;

    public AuthService(
        AppDbContext db,
        IPasswordHasher passwordHasher,
        IJwtTokenGenerator jwtTokenGenerator,
        ICurrentUserService currentUser)
    {
        _db = db;
        _passwordHasher = passwordHasher;
        _jwtTokenGenerator = jwtTokenGenerator;
        _currentUser = currentUser;
    }

    public async Task<AuthResponse> RegistrarEmpresaAsync(RegistrarEmpresaRequest request)
    {
        var emailNormalizado = request.Email.Trim().ToLowerInvariant();
        var agora = DateTimeOffset.UtcNow;

        var emailJaExiste = await _db.Usuarios.AsNoTracking().AnyAsync(u => u.Email == emailNormalizado);
        if (emailJaExiste)
        {
            throw new ConflictAppException("Já existe um usuário cadastrado com este e-mail.");
        }

        var empresa = new Empresa
        {
            Id = Guid.NewGuid(),
            Nome = request.NomeEmpresa.Trim(),
            TipoNegocio = request.TipoNegocio,
            Ativo = true,
            CreatedAt = agora,
            UpdatedAt = agora
        };

        var usuario = new Usuario
        {
            Id = Guid.NewGuid(),
            EmpresaId = empresa.Id,
            Nome = request.NomeAdministrador.Trim(),
            Email = emailNormalizado,
            SenhaHash = _passwordHasher.Hash(request.Senha),
            Role = RoleUsuario.ADMINISTRADOR,
            Ativo = true,
            CreatedAt = agora,
            UpdatedAt = agora
        };

        _db.Empresas.Add(empresa);
        _db.Usuarios.Add(usuario);

        try
        {
            await _db.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            throw new ConflictAppException("Não foi possível concluir o cadastro. Verifique os dados informados.");
        }

        var token = _jwtTokenGenerator.GerarToken(usuario);
        return MontarResposta(token, usuario, empresa);
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var emailNormalizado = request.Email.Trim().ToLowerInvariant();

        var usuario = await _db.Usuarios
            .Include(u => u.Empresa)
            .FirstOrDefaultAsync(u => u.Email == emailNormalizado);

        if (usuario is null || !_passwordHasher.Verify(request.Senha, usuario.SenhaHash))
        {
            throw new UnauthorizedAppException("E-mail ou senha inválidos.");
        }

        if (!usuario.Ativo || !usuario.Empresa.Ativo)
        {
            throw new UnauthorizedAppException("Usuário ou empresa inativos.");
        }

        usuario.UltimoLoginEm = DateTimeOffset.UtcNow;
        await _db.SaveChangesAsync();

        var token = _jwtTokenGenerator.GerarToken(usuario);
        return MontarResposta(token, usuario, usuario.Empresa);
    }

    public async Task<MeResponse> ObterUsuarioAtualAsync()
    {
        var usuario = await _db.Usuarios
            .AsNoTracking()
            .Include(u => u.Empresa)
            .FirstOrDefaultAsync(u => u.Id == _currentUser.UsuarioId && u.EmpresaId == _currentUser.EmpresaId);

        if (usuario is null)
        {
            throw new UnauthorizedAppException("Sessão inválida.");
        }

        return new MeResponse
        {
            Usuario = MapUsuario(usuario),
            Empresa = MapEmpresa(usuario.Empresa)
        };
    }

    private static AuthResponse MontarResposta(string token, Usuario usuario, Empresa empresa) => new()
    {
        Token = token,
        Usuario = MapUsuario(usuario),
        Empresa = MapEmpresa(empresa)
    };

    private static UsuarioResponse MapUsuario(Usuario usuario) => new()
    {
        Id = usuario.Id,
        Nome = usuario.Nome,
        Email = usuario.Email,
        Role = usuario.Role
    };

    private static EmpresaResponse MapEmpresa(Empresa empresa) => new()
    {
        Id = empresa.Id,
        Nome = empresa.Nome,
        NomeFantasia = empresa.NomeFantasia,
        TipoNegocio = empresa.TipoNegocio
    };
}
