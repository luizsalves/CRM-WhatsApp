using WhatsCrm.Api.Interfaces;

namespace WhatsCrm.Api.Services;

public class PasswordHasher : IPasswordHasher
{
    private const int WorkFactor = 11;

    public string Hash(string senha) => BCrypt.Net.BCrypt.HashPassword(senha, WorkFactor);

    public bool Verify(string senha, string hash) => BCrypt.Net.BCrypt.Verify(senha, hash);
}
