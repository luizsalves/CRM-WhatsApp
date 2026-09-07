using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Options;
using WhatsCrm.Api.Extensions;
using WhatsCrm.Api.Interfaces;

namespace WhatsCrm.Api.Services;

public class WebhookSignatureValidator : IWebhookSignatureValidator
{
    private const string Prefixo = "sha256=";
    private readonly WhatsAppSettings _settings;

    public WebhookSignatureValidator(IOptions<WhatsAppSettings> settings)
    {
        _settings = settings.Value;
    }

    public bool AssinaturaValida(string corpoBruto, string? assinaturaHeader)
    {
        if (string.IsNullOrEmpty(assinaturaHeader) || !assinaturaHeader.StartsWith(Prefixo, StringComparison.Ordinal))
        {
            return false;
        }

        if (string.IsNullOrEmpty(_settings.AppSecret))
        {
            return false;
        }

        var assinaturaRecebida = assinaturaHeader[Prefixo.Length..];

        var chave = Encoding.UTF8.GetBytes(_settings.AppSecret);
        var corpo = Encoding.UTF8.GetBytes(corpoBruto);
        var hashCalculado = HMACSHA256.HashData(chave, corpo);
        var assinaturaCalculada = Convert.ToHexStringLower(hashCalculado);

        return CryptographicOperations.FixedTimeEquals(
            Encoding.UTF8.GetBytes(assinaturaCalculada),
            Encoding.UTF8.GetBytes(assinaturaRecebida));
    }
}
