using WhatsCrm.Api.Entities;

namespace WhatsCrm.Api.Interfaces;

public interface IJwtTokenGenerator
{
    string GerarToken(Usuario usuario);
}
