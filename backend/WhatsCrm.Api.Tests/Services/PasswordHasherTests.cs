using WhatsCrm.Api.Services;
using Xunit;

namespace WhatsCrm.Api.Tests.Services;

public class PasswordHasherTests
{
    [Fact]
    public void Hash_GeraHashDiferenteDaSenhaOriginal()
    {
        var hasher = new PasswordHasher();
        var hash = hasher.Hash("minhasenha123");

        Assert.NotEqual("minhasenha123", hash);
    }

    [Fact]
    public void Verify_ComSenhaCorreta_RetornaTrue()
    {
        var hasher = new PasswordHasher();
        var hash = hasher.Hash("minhasenha123");

        Assert.True(hasher.Verify("minhasenha123", hash));
    }

    [Fact]
    public void Verify_ComSenhaIncorreta_RetornaFalse()
    {
        var hasher = new PasswordHasher();
        var hash = hasher.Hash("minhasenha123");

        Assert.False(hasher.Verify("senhaerrada", hash));
    }
}
