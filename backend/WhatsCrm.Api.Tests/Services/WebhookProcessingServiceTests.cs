using Microsoft.Extensions.Logging.Abstractions;
using WhatsCrm.Api.Data;
using WhatsCrm.Api.Entities;
using WhatsCrm.Api.Services;
using WhatsCrm.Api.Tests.TestUtils;
using Xunit;

namespace WhatsCrm.Api.Tests.Services;

public class WebhookProcessingServiceTests
{
    private static string BuildPayloadJson(string phoneNumberId, string from, string profileName, string messageId, string texto)
    {
        return $$"""
        {
          "object": "whatsapp_business_account",
          "entry": [{
            "id": "waba-1",
            "changes": [{
              "field": "messages",
              "value": {
                "metadata": { "display_phone_number": "0000000000", "phone_number_id": "{{phoneNumberId}}" },
                "contacts": [{ "profile": { "name": "{{profileName}}" }, "wa_id": "{{from}}" }],
                "messages": [{
                  "from": "{{from}}",
                  "id": "{{messageId}}",
                  "timestamp": "1700000000",
                  "type": "text",
                  "text": { "body": "{{texto}}" }
                }]
              }
            }]
          }]
        }
        """;
    }

    private static async Task<(AppDbContext Db, WhatsappConta Conta, Guid EmpresaId)> CriarContextoComContaAsync()
    {
        var db = DbContextFactory.CreateInMemory();
        var empresaId = Guid.NewGuid();
        var agora = DateTimeOffset.UtcNow;

        var conta = new WhatsappConta
        {
            Id = Guid.NewGuid(),
            EmpresaId = empresaId,
            PhoneNumberId = "111222333",
            WabaId = "waba-1",
            NumeroExibicao = "+10000000000",
            AccessTokenCriptografado = "token",
            Ativo = true,
            CreatedAt = agora,
            UpdatedAt = agora
        };

        db.WhatsappContas.Add(conta);
        await db.SaveChangesAsync();

        return (db, conta, empresaId);
    }

    [Fact]
    public async Task ProcessarAsync_ComMensagemNova_CriaContatoConversaEMensagem()
    {
        var (db, conta, _) = await CriarContextoComContaAsync();
        var service = new WebhookProcessingService(db, new FakeHubContext(), NullLogger<WebhookProcessingService>.Instance);

        var payload = BuildPayloadJson(conta.PhoneNumberId, "5511988887777", "Cliente Novo", "wamid.AAA", "Ola");
        await service.ProcessarAsync(payload);

        Assert.Single(db.Contatos);
        Assert.Single(db.Conversas);
        Assert.Single(db.Mensagens);
        Assert.Equal("Cliente Novo", db.Contatos.Single().Nome);
        Assert.Equal(1, db.Conversas.Single().QuantidadeNaoLidas);
    }

    [Fact]
    public async Task ProcessarAsync_ComMesmoProviderMessageId_NaoDuplicaMensagem()
    {
        var (db, conta, _) = await CriarContextoComContaAsync();
        var service = new WebhookProcessingService(db, new FakeHubContext(), NullLogger<WebhookProcessingService>.Instance);

        var payload = BuildPayloadJson(conta.PhoneNumberId, "5511988887777", "Cliente Novo", "wamid.AAA", "Ola");
        await service.ProcessarAsync(payload);
        await service.ProcessarAsync(payload);

        Assert.Single(db.Mensagens);
        Assert.Equal(1, db.Conversas.Single().QuantidadeNaoLidas);
    }

    [Fact]
    public async Task ProcessarAsync_ComSegundaMensagemDoMesmoContato_ReaproveitaConversa()
    {
        var (db, conta, _) = await CriarContextoComContaAsync();
        var service = new WebhookProcessingService(db, new FakeHubContext(), NullLogger<WebhookProcessingService>.Instance);

        await service.ProcessarAsync(BuildPayloadJson(conta.PhoneNumberId, "5511988887777", "Cliente Novo", "wamid.AAA", "Ola"));
        await service.ProcessarAsync(BuildPayloadJson(conta.PhoneNumberId, "5511988887777", "Cliente Novo", "wamid.BBB", "Tudo bem?"));

        Assert.Single(db.Contatos);
        Assert.Single(db.Conversas);
        Assert.Equal(2, db.Mensagens.Count());
        Assert.Equal(2, db.Conversas.Single().QuantidadeNaoLidas);
        Assert.Equal("Tudo bem?", db.Conversas.Single().UltimaMensagemTexto);
    }

    [Fact]
    public async Task ProcessarAsync_ComPhoneNumberIdDesconhecido_NaoCriaNada()
    {
        var (db, _, _) = await CriarContextoComContaAsync();
        var service = new WebhookProcessingService(db, new FakeHubContext(), NullLogger<WebhookProcessingService>.Instance);

        var payload = BuildPayloadJson("phone-number-inexistente", "5511988887777", "Cliente Novo", "wamid.AAA", "Ola");
        await service.ProcessarAsync(payload);

        Assert.Empty(db.Contatos);
        Assert.Empty(db.Conversas);
        Assert.Empty(db.Mensagens);
    }
}
