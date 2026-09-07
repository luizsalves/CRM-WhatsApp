namespace WhatsCrm.Api.Entities;

public enum DirecaoMensagem
{
    ENTRADA,
    SAIDA
}

public enum TipoMensagem
{
    TEXTO,
    IMAGEM,
    DOCUMENTO,
    AUDIO,
    VIDEO,
    LOCALIZACAO,
    TEMPLATE
}

public enum StatusMensagem
{
    ENVIANDO,
    ENVIADA,
    ENTREGUE,
    LIDA,
    FALHOU,
    RECEBIDA
}

public class Mensagem
{
    public Guid Id { get; set; }
    public Guid EmpresaId { get; set; }
    public Guid ConversaId { get; set; }
    public string? ProviderMessageId { get; set; }
    public DirecaoMensagem Direcao { get; set; }
    public TipoMensagem Tipo { get; set; }
    public string? Texto { get; set; }
    public StatusMensagem Status { get; set; }
    public DateTimeOffset? EnviadaEm { get; set; }
    public DateTimeOffset? RecebidaEm { get; set; }
    public DateTimeOffset? LidaEm { get; set; }
    public DateTimeOffset CreatedAt { get; set; }

    public Conversa Conversa { get; set; } = null!;
}
