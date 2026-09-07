using Microsoft.AspNetCore.SignalR;
using WhatsCrm.Api.Hubs;

namespace WhatsCrm.Api.Tests.TestUtils;

public class FakeClientProxy : IClientProxy
{
    public List<(string Method, object?[] Args)> Chamadas { get; } = new();

    public Task SendCoreAsync(string method, object?[] args, CancellationToken cancellationToken = default)
    {
        Chamadas.Add((method, args));
        return Task.CompletedTask;
    }
}

public class FakeHubClients : IHubClients
{
    public FakeClientProxy Grupo { get; } = new();

    public IClientProxy All => Grupo;
    public IClientProxy AllExcept(IReadOnlyList<string> excludedConnectionIds) => Grupo;
    public IClientProxy Client(string connectionId) => Grupo;
    public IClientProxy Clients(IReadOnlyList<string> connectionIds) => Grupo;
    public IClientProxy Group(string groupName) => Grupo;
    public IClientProxy GroupExcept(string groupName, IReadOnlyList<string> excludedConnectionIds) => Grupo;
    public IClientProxy Groups(IReadOnlyList<string> groupNames) => Grupo;
    public IClientProxy User(string userId) => Grupo;
    public IClientProxy Users(IReadOnlyList<string> userIds) => Grupo;
}

public class FakeHubContext : IHubContext<ConversationsHub>
{
    public FakeHubClients FakeClients { get; } = new();
    public IHubClients Clients => FakeClients;
    public IGroupManager Groups => throw new NotSupportedException("Não usado nos testes.");
}
