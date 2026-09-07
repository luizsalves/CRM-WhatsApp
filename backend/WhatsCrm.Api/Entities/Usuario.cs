namespace WhatsCrm.Api.Entities;

public class Usuario
{
    public Guid Id { get; set; }
    public Guid EmpresaId { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string SenhaHash { get; set; } = string.Empty;
    public RoleUsuario Role { get; set; }
    public bool Ativo { get; set; } = true;
    public DateTimeOffset? UltimoLoginEm { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public Empresa Empresa { get; set; } = null!;
}
