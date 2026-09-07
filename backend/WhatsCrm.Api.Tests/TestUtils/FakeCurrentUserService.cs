using WhatsCrm.Api.Interfaces;

namespace WhatsCrm.Api.Tests.TestUtils;

public class FakeCurrentUserService : ICurrentUserService
{
    public bool EstaAutenticado { get; set; } = true;
    public Guid EmpresaId { get; set; }
    public Guid UsuarioId { get; set; }
    public string Role { get; set; } = "ADMINISTRADOR";
}
