using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Options;
using WhatsCrm.Api.Extensions;
using WhatsCrm.Api.Services;
using Xunit;

namespace WhatsCrm.Api.Tests.Services;

public class WebhookSignatureValidatorTests
{
    private const string AppSecret = "app-secret-de-teste";

    private static WebhookSignatureValidator CreateValidator() =>
        new(Options.Create(new WhatsAppSettings { AppSecret = AppSecret }));

    private static string AssinarCorpo(string corpo)
    {
        var hash = HMACSHA256.HashData(Encoding.UTF8.GetBytes(AppSecret), Encoding.UTF8.GetBytes(corpo));
        return "sha256=" + Convert.ToHexStringLower(hash);
    }

    [Fact]
    public void AssinaturaValida_ComAssinaturaCorreta_RetornaTrue()
    {
        var corpo = "{\"teste\":true}";
        var assinatura = AssinarCorpo(corpo);

        Assert.True(CreateValidator().AssinaturaValida(corpo, assinatura));
    }

    [Fact]
    public void AssinaturaValida_ComAssinaturaIncorreta_RetornaFalse()
    {
        var corpo = "{\"teste\":true}";

        Assert.False(CreateValidator().AssinaturaValida(corpo, "sha256=00112233"));
    }

    [Fact]
    public void AssinaturaValida_ComCorpoAlterado_RetornaFalse()
    {
        var assinatura = AssinarCorpo("{\"teste\":true}");

        Assert.False(CreateValidator().AssinaturaValida("{\"teste\":false}", assinatura));
    }

    [Fact]
    public void AssinaturaValida_SemHeader_RetornaFalse()
    {
        Assert.False(CreateValidator().AssinaturaValida("{}", null));
    }
}
