using WhatsCrm.Api.DTOs;
using WhatsCrm.Api.Entities;
using WhatsCrm.Api.Exceptions;
using WhatsCrm.Api.Services;
using WhatsCrm.Api.Tests.TestUtils;
using Xunit;

namespace WhatsCrm.Api.Tests.Services;

public class AuthServiceTests
{
    private static AuthService CreateService(Data.AppDbContext db, FakeCurrentUserService? currentUser = null) =>
        new(db, new PasswordHasher(), new FakeJwtTokenGenerator(), currentUser ?? new FakeCurrentUserService());

    [Fact]
    public async Task RegistrarEmpresaAsync_ComDadosValidos_CriaEmpresaEUsuarioAdministrador()
    {
        using var db = DbContextFactory.CreateInMemory();
        var service = CreateService(db);

        var resultado = await service.RegistrarEmpresaAsync(new RegistrarEmpresaRequest
        {
            NomeEmpresa = "Clinica Sorriso",
            TipoNegocio = TipoNegocio.CLINICA,
            NomeAdministrador = "Ana Admin",
            Email = "ana@sorriso.com",
            Senha = "senha12345"
        });

        Assert.NotEmpty(resultado.Token);
        Assert.Equal(RoleUsuario.ADMINISTRADOR, resultado.Usuario.Role);
        Assert.Equal("Clinica Sorriso", resultado.Empresa.Nome);
        Assert.Single(db.Empresas);
        Assert.Single(db.Usuarios);
    }

    [Fact]
    public async Task RegistrarEmpresaAsync_ComEmailJaExistente_LancaConflict()
    {
        using var db = DbContextFactory.CreateInMemory();
        var service = CreateService(db);

        await service.RegistrarEmpresaAsync(new RegistrarEmpresaRequest
        {
            NomeEmpresa = "Empresa A",
            TipoNegocio = TipoNegocio.VENDAS,
            NomeAdministrador = "Admin A",
            Email = "duplicado@teste.com",
            Senha = "senha12345"
        });

        await Assert.ThrowsAsync<ConflictAppException>(() => service.RegistrarEmpresaAsync(new RegistrarEmpresaRequest
        {
            NomeEmpresa = "Empresa B",
            TipoNegocio = TipoNegocio.VENDAS,
            NomeAdministrador = "Admin B",
            Email = "duplicado@teste.com",
            Senha = "outrasenha123"
        }));
    }

    [Fact]
    public async Task LoginAsync_ComCredenciaisValidas_RetornaToken()
    {
        using var db = DbContextFactory.CreateInMemory();
        var service = CreateService(db);
        await service.RegistrarEmpresaAsync(new RegistrarEmpresaRequest
        {
            NomeEmpresa = "Empresa A",
            TipoNegocio = TipoNegocio.VENDAS,
            NomeAdministrador = "Admin A",
            Email = "login@teste.com",
            Senha = "senha12345"
        });

        var resultado = await service.LoginAsync(new LoginRequest { Email = "login@teste.com", Senha = "senha12345" });

        Assert.NotEmpty(resultado.Token);
        Assert.Equal("login@teste.com", resultado.Usuario.Email);
    }

    [Fact]
    public async Task LoginAsync_ComSenhaErrada_LancaUnauthorized()
    {
        using var db = DbContextFactory.CreateInMemory();
        var service = CreateService(db);
        await service.RegistrarEmpresaAsync(new RegistrarEmpresaRequest
        {
            NomeEmpresa = "Empresa A",
            TipoNegocio = TipoNegocio.VENDAS,
            NomeAdministrador = "Admin A",
            Email = "senhaerrada@teste.com",
            Senha = "senhacorreta123"
        });

        await Assert.ThrowsAsync<UnauthorizedAppException>(() =>
            service.LoginAsync(new LoginRequest { Email = "senhaerrada@teste.com", Senha = "senhaerrada" }));
    }

    [Fact]
    public async Task LoginAsync_ComUsuarioInexistente_LancaUnauthorized()
    {
        using var db = DbContextFactory.CreateInMemory();
        var service = CreateService(db);

        await Assert.ThrowsAsync<UnauthorizedAppException>(() =>
            service.LoginAsync(new LoginRequest { Email = "naoexiste@teste.com", Senha = "qualquer123" }));
    }

    [Fact]
    public async Task LoginAsync_ComUsuarioInativo_LancaUnauthorized()
    {
        using var db = DbContextFactory.CreateInMemory();
        var service = CreateService(db);
        var registro = await service.RegistrarEmpresaAsync(new RegistrarEmpresaRequest
        {
            NomeEmpresa = "Empresa A",
            TipoNegocio = TipoNegocio.VENDAS,
            NomeAdministrador = "Admin A",
            Email = "inativo@teste.com",
            Senha = "senha12345"
        });

        var usuario = db.Usuarios.Single(u => u.Email == "inativo@teste.com");
        usuario.Ativo = false;
        await db.SaveChangesAsync();

        await Assert.ThrowsAsync<UnauthorizedAppException>(() =>
            service.LoginAsync(new LoginRequest { Email = "inativo@teste.com", Senha = "senha12345" }));
    }

    [Fact]
    public async Task LoginAsync_ComEmpresaInativa_LancaUnauthorized()
    {
        using var db = DbContextFactory.CreateInMemory();
        var service = CreateService(db);
        await service.RegistrarEmpresaAsync(new RegistrarEmpresaRequest
        {
            NomeEmpresa = "Empresa Inativa",
            TipoNegocio = TipoNegocio.VENDAS,
            NomeAdministrador = "Admin A",
            Email = "empresainativa@teste.com",
            Senha = "senha12345"
        });

        var empresa = db.Empresas.Single(e => e.Nome == "Empresa Inativa");
        empresa.Ativo = false;
        await db.SaveChangesAsync();

        await Assert.ThrowsAsync<UnauthorizedAppException>(() =>
            service.LoginAsync(new LoginRequest { Email = "empresainativa@teste.com", Senha = "senha12345" }));
    }

    [Fact]
    public async Task ObterUsuarioAtualAsync_ComContextoValido_RetornaDadosDoUsuario()
    {
        using var db = DbContextFactory.CreateInMemory();
        var registroService = CreateService(db);
        var registro = await registroService.RegistrarEmpresaAsync(new RegistrarEmpresaRequest
        {
            NomeEmpresa = "Empresa A",
            TipoNegocio = TipoNegocio.VENDAS,
            NomeAdministrador = "Admin A",
            Email = "me@teste.com",
            Senha = "senha12345"
        });

        var currentUser = new FakeCurrentUserService
        {
            EmpresaId = registro.Empresa.Id,
            UsuarioId = registro.Usuario.Id
        };
        var service = CreateService(db, currentUser);

        var resultado = await service.ObterUsuarioAtualAsync();

        Assert.Equal("me@teste.com", resultado.Usuario.Email);
        Assert.Equal(registro.Empresa.Id, resultado.Empresa.Id);
    }

    [Fact]
    public async Task ObterUsuarioAtualAsync_ComEmpresaIdDeOutroTenant_NaoRetornaDadosDoUsuario()
    {
        // Simula um cenário de isolamento multiempresa: mesmo que alguém tente montar um
        // contexto com o UsuarioId correto mas um EmpresaId de outra empresa, a consulta
        // filtrada por (UsuarioId + EmpresaId) não deve encontrar o usuário.
        using var db = DbContextFactory.CreateInMemory();
        var registroService = CreateService(db);
        var registroEmpresaA = await registroService.RegistrarEmpresaAsync(new RegistrarEmpresaRequest
        {
            NomeEmpresa = "Empresa A",
            TipoNegocio = TipoNegocio.VENDAS,
            NomeAdministrador = "Admin A",
            Email = "usuarioA@teste.com",
            Senha = "senha12345"
        });
        var registroEmpresaB = await registroService.RegistrarEmpresaAsync(new RegistrarEmpresaRequest
        {
            NomeEmpresa = "Empresa B",
            TipoNegocio = TipoNegocio.CLINICA,
            NomeAdministrador = "Admin B",
            Email = "usuarioB@teste.com",
            Senha = "senha12345"
        });

        var currentUser = new FakeCurrentUserService
        {
            EmpresaId = registroEmpresaB.Empresa.Id,
            UsuarioId = registroEmpresaA.Usuario.Id
        };
        var service = CreateService(db, currentUser);

        await Assert.ThrowsAsync<UnauthorizedAppException>(() => service.ObterUsuarioAtualAsync());
    }
}
