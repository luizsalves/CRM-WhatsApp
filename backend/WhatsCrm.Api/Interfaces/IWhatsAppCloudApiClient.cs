namespace WhatsCrm.Api.Interfaces;

public interface IWhatsAppCloudApiClient
{
    /// <summary>Envia uma mensagem de texto e retorna o provider_message_id (WAMID) atribuído pela Meta.</summary>
    Task<string> EnviarTextoAsync(string phoneNumberId, string accessToken, string telefoneDestino, string texto);
}
