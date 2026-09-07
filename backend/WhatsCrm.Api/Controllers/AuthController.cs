using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WhatsCrm.Api.DTOs;
using WhatsCrm.Api.Interfaces;

namespace WhatsCrm.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    /// <summary>Registra uma nova empresa (tenant) e seu primeiro usuário administrador.</summary>
    [HttpPost("registrar-empresa")]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<AuthResponse>> RegistrarEmpresa([FromBody] RegistrarEmpresaRequest request)
    {
        var resultado = await _authService.RegistrarEmpresaAsync(request);
        return StatusCode(StatusCodes.Status201Created, resultado);
    }

    /// <summary>Autentica um usuário e retorna um token JWT.</summary>
    [HttpPost("login")]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
    {
        var resultado = await _authService.LoginAsync(request);
        return Ok(resultado);
    }

    /// <summary>Retorna os dados do usuário autenticado.</summary>
    [HttpGet("me")]
    [Authorize]
    [ProducesResponseType(typeof(MeResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<MeResponse>> Me()
    {
        var resultado = await _authService.ObterUsuarioAtualAsync();
        return Ok(resultado);
    }
}
