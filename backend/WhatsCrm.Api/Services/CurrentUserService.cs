using System.Security.Claims;
using WhatsCrm.Api.Interfaces;

namespace WhatsCrm.Api.Services;

/// <summary>
/// Lê o contexto do usuário autenticado exclusivamente das claims do JWT já validado
/// pelo middleware de autenticação (HttpContext.User). Nunca aceita EmpresaId vindo
/// de rota, query string ou corpo da requisição.
/// </summary>
public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    private ClaimsPrincipal? User => _httpContextAccessor.HttpContext?.User;

    public bool EstaAutenticado => User?.Identity?.IsAuthenticated ?? false;

    public Guid EmpresaId
    {
        get
        {
            var valor = User?.FindFirstValue("empresa_id");
            if (string.IsNullOrEmpty(valor) || !Guid.TryParse(valor, out var empresaId))
            {
                throw new InvalidOperationException("Usuário não autenticado ou token sem empresa_id.");
            }

            return empresaId;
        }
    }

    public Guid UsuarioId
    {
        get
        {
            var valor = User?.FindFirstValue(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub);
            if (string.IsNullOrEmpty(valor) || !Guid.TryParse(valor, out var usuarioId))
            {
                throw new InvalidOperationException("Usuário não autenticado.");
            }

            return usuarioId;
        }
    }

    public string Role => User?.FindFirstValue(ClaimTypes.Role) ?? string.Empty;
}
