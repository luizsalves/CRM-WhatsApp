namespace WhatsCrm.Api.Interfaces;

public interface IWebhookSignatureValidator
{
    /// <summary>Valida o header X-Hub-Signature-256 (HMAC-SHA256 do corpo bruto com o App Secret da Meta).</summary>
    bool AssinaturaValida(string corpoBruto, string? assinaturaHeader);
}
