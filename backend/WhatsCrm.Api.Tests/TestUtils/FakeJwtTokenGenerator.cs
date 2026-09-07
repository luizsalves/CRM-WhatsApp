using WhatsCrm.Api.Entities;
using WhatsCrm.Api.Interfaces;

namespace WhatsCrm.Api.Tests.TestUtils;

public class FakeJwtTokenGenerator : IJwtTokenGenerator
{
    public string GerarToken(Usuario usuario) => $"fake-token-for-{usuario.Id}";
}
