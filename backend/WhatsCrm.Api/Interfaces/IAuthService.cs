using WhatsCrm.Api.DTOs;

namespace WhatsCrm.Api.Interfaces;

public interface IAuthService
{
    Task<AuthResponse> RegistrarEmpresaAsync(RegistrarEmpresaRequest request);
    Task<AuthResponse> LoginAsync(LoginRequest request);
    Task<MeResponse> ObterUsuarioAtualAsync();
}
