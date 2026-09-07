using WhatsCrm.Api.DTOs;
using WhatsCrm.Api.Exceptions;
using WhatsCrm.Api.Services;
using WhatsCrm.Api.Tests.TestUtils;
using Xunit;

namespace WhatsCrm.Api.Tests.Services;

public class ContatoServiceTests
{
    private static CreateContatoRequest NovoContatoRequest(string nome = "Fulano", string telefone = "+5511999990001") => new()
    {
        Nome = nome,
        Telefone = telefone
    };

    [Fact]
    public async Task CriarAsync_ComDadosValidos_CriaContato()
    {
        using var db = DbContextFactory.CreateInMemory();
        var empresaId = Guid.NewGuid();
        var service = new ContatoService(db, new FakeCurrentUserService { EmpresaId = empresaId });

        var resultado = await service.CriarAsync(NovoContatoRequest());

        Assert.Equal("Fulano", resultado.Nome);
        Assert.Empty(resultado.Tags);
    }

    [Fact]
    public async Task CriarAsync_ComTelefoneDuplicadoNaMesmaEmpresa_LancaConflict()
    {
        using var db = DbContextFactory.CreateInMemory();
        var empresaId = Guid.NewGuid();
        var service = new ContatoService(db, new FakeCurrentUserService { EmpresaId = empresaId });

        await service.CriarAsync(NovoContatoRequest());

        await Assert.ThrowsAsync<ConflictAppException>(() => service.CriarAsync(NovoContatoRequest(nome: "Outro Nome")));
    }

    [Fact]
    public async Task CriarAsync_ComMesmoTelefoneEmEmpresasDiferentes_NaoConflita()
    {
        using var db = DbContextFactory.CreateInMemory();
        var serviceEmpresaA = new ContatoService(db, new FakeCurrentUserService { EmpresaId = Guid.NewGuid() });
        var serviceEmpresaB = new ContatoService(db, new FakeCurrentUserService { EmpresaId = Guid.NewGuid() });

        await serviceEmpresaA.CriarAsync(NovoContatoRequest());
        var resultado = await serviceEmpresaB.CriarAsync(NovoContatoRequest());

        Assert.NotNull(resultado);
    }

    [Fact]
    public async Task ObterPorIdAsync_DeOutraEmpresa_LancaNotFound()
    {
        using var db = DbContextFactory.CreateInMemory();
        var serviceEmpresaA = new ContatoService(db, new FakeCurrentUserService { EmpresaId = Guid.NewGuid() });
        var serviceEmpresaB = new ContatoService(db, new FakeCurrentUserService { EmpresaId = Guid.NewGuid() });

        var contato = await serviceEmpresaA.CriarAsync(NovoContatoRequest());

        await Assert.ThrowsAsync<NotFoundAppException>(() => serviceEmpresaB.ObterPorIdAsync(contato.Id));
    }

    [Fact]
    public async Task AdicionarTagERemoverTag_AtualizaListaDeTagsDoContato()
    {
        using var db = DbContextFactory.CreateInMemory();
        var empresaId = Guid.NewGuid();
        var currentUser = new FakeCurrentUserService { EmpresaId = empresaId };
        var contatoService = new ContatoService(db, currentUser);
        var tagService = new TagService(db, currentUser);

        var contato = await contatoService.CriarAsync(NovoContatoRequest());
        var tag = await tagService.CriarAsync(new CreateTagRequest { Nome = "VIP", Cor = "#128C7E" });

        var comTag = await contatoService.AdicionarTagAsync(contato.Id, tag.Id);
        Assert.Single(comTag.Tags);
        Assert.Equal("VIP", comTag.Tags[0].Nome);

        var semTag = await contatoService.RemoverTagAsync(contato.Id, tag.Id);
        Assert.Empty(semTag.Tags);
    }
}
