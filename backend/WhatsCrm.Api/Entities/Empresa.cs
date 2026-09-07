namespace WhatsCrm.Api.Entities;

public class Empresa
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string? NomeFantasia { get; set; }
    public string? Cnpj { get; set; }
    public TipoNegocio TipoNegocio { get; set; }
    public bool Ativo { get; set; } = true;
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public ICollection<Usuario> Usuarios { get; set; } = new List<Usuario>();
}
