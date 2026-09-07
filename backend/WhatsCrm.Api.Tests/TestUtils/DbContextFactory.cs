using Microsoft.EntityFrameworkCore;
using WhatsCrm.Api.Data;

namespace WhatsCrm.Api.Tests.TestUtils;

public static class DbContextFactory
{
    public static AppDbContext CreateInMemory()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new AppDbContext(options);
    }
}
