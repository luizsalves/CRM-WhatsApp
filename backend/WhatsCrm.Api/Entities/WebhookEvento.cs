namespace WhatsCrm.Api.Entities;

public enum TipoWebhookEvento
{
    MENSAGEM,
    STATUS,
    OUTRO
}

public class WebhookEvento
{
    public Guid Id { get; set; }
    public Guid? EmpresaId { get; set; }
    public Guid? WhatsappContaId { get; set; }
    public string ProviderEventId { get; set; } = string.Empty;
    public TipoWebhookEvento Tipo { get; set; }
    public string Payload { get; set; } = string.Empty;
    public bool Processado { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? ProcessedAt { get; set; }
}
