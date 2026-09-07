using System.ComponentModel.DataAnnotations;
using WhatsCrm.Api.Entities;

namespace WhatsCrm.Api.DTOs;

public class RegistrarEmpresaRequest
{
    [Required(ErrorMessage = "O nome da empresa é obrigatório.")]
    [MaxLength(200)]
    public string NomeEmpresa { get; set; } = string.Empty;

    [Required(ErrorMessage = "O tipo de negócio é obrigatório.")]
    public TipoNegocio TipoNegocio { get; set; }

    [Required(ErrorMessage = "O nome do administrador é obrigatório.")]
    [MaxLength(200)]
    public string NomeAdministrador { get; set; } = string.Empty;

    [Required(ErrorMessage = "O e-mail é obrigatório.")]
    [EmailAddress(ErrorMessage = "E-mail inválido.")]
    [MaxLength(200)]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "A senha é obrigatória.")]
    [MinLength(8, ErrorMessage = "A senha deve ter ao menos 8 caracteres.")]
    public string Senha { get; set; } = string.Empty;
}

public class LoginRequest
{
    [Required(ErrorMessage = "O e-mail é obrigatório.")]
    [EmailAddress(ErrorMessage = "E-mail inválido.")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "A senha é obrigatória.")]
    public string Senha { get; set; } = string.Empty;
}

public class EmpresaResponse
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string? NomeFantasia { get; set; }
    public TipoNegocio TipoNegocio { get; set; }
}

public class UsuarioResponse
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public RoleUsuario Role { get; set; }
}

public class AuthResponse
{
    public string Token { get; set; } = string.Empty;
    public UsuarioResponse Usuario { get; set; } = null!;
    public EmpresaResponse Empresa { get; set; } = null!;
}

public class MeResponse
{
    public UsuarioResponse Usuario { get; set; } = null!;
    public EmpresaResponse Empresa { get; set; } = null!;
}
