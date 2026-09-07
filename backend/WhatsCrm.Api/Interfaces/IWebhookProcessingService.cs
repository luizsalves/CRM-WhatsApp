namespace WhatsCrm.Api.Interfaces;

public interface IWebhookProcessingService
{
    /// <summary>Processa o payload bruto (JSON) de um webhook já autenticado da WhatsApp Cloud API.</summary>
    Task ProcessarAsync(string payloadJson);
}
