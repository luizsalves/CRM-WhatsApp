using System.ComponentModel.DataAnnotations;

namespace WhatsCrm.Api.DTOs;

public class CreateContatoRequest
{
    [Required(ErrorMessage = "O nome é obrigatório.")]
    [MaxLength(200)]
    public string Nome { get; set; } = string.Empty;

    [Required(ErrorMessage = "O telefone é obrigatório.")]
    [RegularExpression(@"^\+[1-9]\d{7,14}$", ErrorMessage = "Telefone deve estar no formato E.164, ex.: +5511999999999.")]
    public string Telefone { get; set; } = string.Empty;

    [EmailAddress(ErrorMessage = "E-mail inválido.")]
    [MaxLength(200)]
    public string? Email { get; set; }

    public DateOnly? DataNascimento { get; set; }

    [MaxLength(200)]
    public string? EmpresaNome { get; set; }

    public string? Observacoes { get; set; }

    public Guid? ResponsavelUsuarioId { get; set; }
}

public class UpdateContatoRequest : CreateContatoRequest
{
}

public class TagResponse
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Cor { get; set; } = string.Empty;
}

public class ContatoResponse
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Telefone { get; set; } = string.Empty;
    public string? Email { get; set; }
    public DateOnly? DataNascimento { get; set; }
    public string? EmpresaNome { get; set; }
    public string? Observacoes { get; set; }
    public Guid? ResponsavelUsuarioId { get; set; }
    public IReadOnlyList<TagResponse> Tags { get; set; } = Array.Empty<TagResponse>();
    public DateTimeOffset CreatedAt { get; set; }
}
