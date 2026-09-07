namespace WhatsCrm.Api.Entities;

public class Conversa
{
    public Guid Id { get; set; }
    public Guid EmpresaId { get; set; }
    public Guid ContatoId { get; set; }
    public Guid WhatsappContaId { get; set; }
    public Guid? ResponsavelUsuarioId { get; set; }
    public StatusConversa Status { get; set; } = StatusConversa.ABERTA;
    public DateTimeOffset UltimaMensagemEm { get; set; }
    public string? UltimaMensagemTexto { get; set; }
    public int QuantidadeNaoLidas { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public Contato Contato { get; set; } = null!;
    public WhatsappConta WhatsappConta { get; set; } = null!;
    public Usuario? ResponsavelUsuario { get; set; }
    public ICollection<Mensagem> Mensagens { get; set; } = new List<Mensagem>();
}
