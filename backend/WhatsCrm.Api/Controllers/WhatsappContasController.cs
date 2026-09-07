using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WhatsCrm.Api.DTOs;
using WhatsCrm.Api.Entities;
using WhatsCrm.Api.Interfaces;

namespace WhatsCrm.Api.Controllers;

[ApiController]
[Authorize(Roles = nameof(RoleUsuario.ADMINISTRADOR) + "," + nameof(RoleUsuario.GESTOR))]
[Route("api/whatsapp-contas")]
public class WhatsappContasController : ControllerBase
{
    private readonly IWhatsappContaService _whatsappContaService;

    public WhatsappContasController(IWhatsappContaService whatsappContaService)
    {
        _whatsappContaService = whatsappContaService;
    }

    [HttpGet]
    public async Task<ActionResult<WhatsappContaResponse?>> ObterAtual()
    {
        return Ok(await _whatsappContaService.ObterDaEmpresaAtualAsync());
    }

    [HttpPost]
    public async Task<ActionResult<WhatsappContaResponse>> Salvar([FromBody] CreateWhatsappContaRequest request)
    {
        return Ok(await _whatsappContaService.SalvarAsync(request));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Desativar(Guid id)
    {
        await _whatsappContaService.DesativarAsync(id);
        return NoContent();
    }
}
