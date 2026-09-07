using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.Extensions.Options;
using WhatsCrm.Api.Entities;
using WhatsCrm.Api.Extensions;
using WhatsCrm.Api.Services;
using Xunit;

namespace WhatsCrm.Api.Tests.Services;

public class JwtTokenGeneratorTests
{
    private static JwtTokenGenerator CreateGenerator() => new(Options.Create(new JwtSettings
    {
        Secret = "unit-test-secret-key-com-pelo-menos-32-caracteres",
        Issuer = "WhatsCrm.Api.Tests",
        Audience = "WhatsCrm.Client.Tests",
        ExpiracaoMinutos = 60
    }));

    [Fact]
    public void GerarToken_IncluiClaimsObrigatorias()
    {
        var usuario = new Usuario
        {
            Id = Guid.NewGuid(),
            EmpresaId = Guid.NewGuid(),
            Nome = "Fulano",
            Email = "fulano@teste.com",
            Role = RoleUsuario.GESTOR
        };

        var token = CreateGenerator().GerarToken(usuario);

        var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token);

        Assert.Equal(usuario.Id.ToString(), jwt.Claims.First(c => c.Type == JwtRegisteredClaimNames.Sub).Value);
        Assert.Equal(usuario.EmpresaId.ToString(), jwt.Claims.First(c => c.Type == "empresa_id").Value);
        Assert.Equal(usuario.Email, jwt.Claims.First(c => c.Type == JwtRegisteredClaimNames.Email).Value);
        Assert.Equal("GESTOR", jwt.Claims.First(c => c.Type == ClaimTypes.Role).Value);
    }
}
