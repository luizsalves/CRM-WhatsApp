namespace WhatsCrm.Api.Entities;

public class Contato
{
    public Guid Id { get; set; }
    public Guid EmpresaId { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Telefone { get; set; } = string.Empty;
    public string? Email { get; set; }
    public DateOnly? DataNascimento { get; set; }
    public string? EmpresaNome { get; set; }
    public string? Observacoes { get; set; }
    public Guid? ResponsavelUsuarioId { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public Empresa Empresa { get; set; } = null!;
    public Usuario? ResponsavelUsuario { get; set; }
    public ICollection<ContatoTag> ContatoTags { get; set; } = new List<ContatoTag>();
}
