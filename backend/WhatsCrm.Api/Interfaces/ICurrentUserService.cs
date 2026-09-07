namespace WhatsCrm.Api.Interfaces;

/// <summary>
/// Contexto do usuário autenticado, extraído exclusivamente das claims do JWT validado.
/// Nunca deve ser preenchido a partir de dados enviados pelo cliente (rota, query, body).
/// </summary>
public interface ICurrentUserService
{
    bool EstaAutenticado { get; }
    Guid EmpresaId { get; }
    Guid UsuarioId { get; }
    string Role { get; }
}
