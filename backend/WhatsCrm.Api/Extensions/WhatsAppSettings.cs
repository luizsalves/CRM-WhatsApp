namespace WhatsCrm.Api.Extensions;

public class WhatsAppSettings
{
    public const string SectionName = "WhatsApp";

    /// <summary>Token arbitrário definido por nós e configurado também no painel da Meta, usado no handshake do webhook.</summary>
    public string VerifyToken { get; set; } = string.Empty;

    /// <summary>App Secret do App da Meta, usado para validar a assinatura HMAC dos webhooks.</summary>
    public string AppSecret { get; set; } = string.Empty;

    public string ApiBaseUrl { get; set; } = "https://graph.facebook.com/v20.0";
}
