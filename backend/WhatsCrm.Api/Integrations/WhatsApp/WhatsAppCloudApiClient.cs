using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Options;
using WhatsCrm.Api.Exceptions;
using WhatsCrm.Api.Extensions;
using WhatsCrm.Api.Interfaces;

namespace WhatsCrm.Api.Integrations.WhatsApp;

public class WhatsAppCloudApiClient : IWhatsAppCloudApiClient
{
    private readonly HttpClient _httpClient;
    private readonly WhatsAppSettings _settings;
    private readonly ILogger<WhatsAppCloudApiClient> _logger;

    public WhatsAppCloudApiClient(HttpClient httpClient, IOptions<WhatsAppSettings> settings, ILogger<WhatsAppCloudApiClient> logger)
    {
        _httpClient = httpClient;
        _settings = settings.Value;
        _logger = logger;
    }

    public async Task<string> EnviarTextoAsync(string phoneNumberId, string accessToken, string telefoneDestino, string texto)
    {
        var url = $"{_settings.ApiBaseUrl}/{phoneNumberId}/messages";

        using var mensagem = new HttpRequestMessage(HttpMethod.Post, url);
        mensagem.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        mensagem.Content = JsonContent.Create(new
        {
            messaging_product = "whatsapp",
            to = telefoneDestino,
            type = "text",
            text = new { body = texto }
        });

        HttpResponseMessage resposta;
        string corpoResposta;

        try
        {
            resposta = await _httpClient.SendAsync(mensagem);
            corpoResposta = await resposta.Content.ReadAsStringAsync();
        }
        catch (Exception ex) when (ex is HttpRequestException or TaskCanceledException)
        {
            _logger.LogWarning(ex, "Falha de conexão ao chamar a WhatsApp Cloud API.");
            throw new WhatsAppApiException("Não foi possível conectar ao WhatsApp agora. Tente novamente em instantes.");
        }

        if (!resposta.IsSuccessStatusCode)
        {
            _logger.LogWarning("Falha ao enviar mensagem via WhatsApp Cloud API: {Status} {Corpo}", resposta.StatusCode, corpoResposta);
            throw new WhatsAppApiException("Não foi possível enviar a mensagem pelo WhatsApp. Verifique a conexão da conta e tente novamente.");
        }

        var resultado = JsonSerializer.Deserialize<EnvioResposta>(corpoResposta);
        var providerMessageId = resultado?.Messages?.FirstOrDefault()?.Id;

        if (string.IsNullOrEmpty(providerMessageId))
        {
            throw new WhatsAppApiException("A WhatsApp Cloud API não retornou o identificador da mensagem enviada.");
        }

        return providerMessageId;
    }

    private class EnvioResposta
    {
        [JsonPropertyName("messages")]
        public List<MensagemResposta>? Messages { get; set; }
    }

    private class MensagemResposta
    {
        [JsonPropertyName("id")]
        public string? Id { get; set; }
    }
}
