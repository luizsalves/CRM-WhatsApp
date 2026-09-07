using System.ComponentModel.DataAnnotations;
using WhatsCrm.Api.Entities;

namespace WhatsCrm.Api.DTOs;

public class ContatoResumoResponse
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Telefone { get; set; } = string.Empty;
}

public class ConversaResponse
{
    public Guid Id { get; set; }
    public ContatoResumoResponse Contato { get; set; } = null!;
    public Guid? ResponsavelUsuarioId { get; set; }
    public StatusConversa Status { get; set; }
    public DateTimeOffset UltimaMensagemEm { get; set; }
    public string? UltimaMensagemTexto { get; set; }
    public int QuantidadeNaoLidas { get; set; }
}

public class MensagemResponse
{
    public Guid Id { get; set; }
    public Guid ConversaId { get; set; }
    public DirecaoMensagem Direcao { get; set; }
    public TipoMensagem Tipo { get; set; }
    public string? Texto { get; set; }
    public StatusMensagem Status { get; set; }
    public DateTimeOffset? EnviadaEm { get; set; }
    public DateTimeOffset? RecebidaEm { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
}

public class EnviarMensagemRequest
{
    [Required(ErrorMessage = "O texto da mensagem é obrigatório.")]
    [MaxLength(4096)]
    public string Texto { get; set; } = string.Empty;
}

public class AtualizarResponsavelRequest
{
    public Guid? ResponsavelUsuarioId { get; set; }
}

public class AtualizarStatusConversaRequest
{
    [Required]
    public StatusConversa Status { get; set; }
}
