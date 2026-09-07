using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using WhatsCrm.Api.Interfaces;

namespace WhatsCrm.Api.Hubs;

[Authorize]
public class ConversationsHub : Hub
{
    private readonly ICurrentUserService _currentUser;

    public ConversationsHub(ICurrentUserService currentUser)
    {
        _currentUser = currentUser;
    }

    public static string GrupoDaEmpresa(Guid empresaId) => $"empresa-{empresaId}";

    public override async Task OnConnectedAsync()
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, GrupoDaEmpresa(_currentUser.EmpresaId));
        await base.OnConnectedAsync();
    }
}
