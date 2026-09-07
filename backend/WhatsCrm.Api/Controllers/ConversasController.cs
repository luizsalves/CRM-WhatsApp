using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WhatsCrm.Api.DTOs;
using WhatsCrm.Api.Entities;
using WhatsCrm.Api.Interfaces;

namespace WhatsCrm.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/conversas")]
public class ConversasController : ControllerBase
{
    private readonly IConversaService _conversaService;

    public ConversasController(IConversaService conversaService)
    {
        _conversaService = conversaService;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResult<ConversaResponse>>> Listar(
        [FromQuery] StatusConversa? status, [FromQuery] int pagina = 1, [FromQuery] int tamanhoPagina = 20)
    {
        return Ok(await _conversaService.ListarAsync(status, pagina, tamanhoPagina));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ConversaResponse>> ObterPorId(Guid id)
    {
        return Ok(await _conversaService.ObterPorIdAsync(id));
    }

    [HttpGet("{id:guid}/mensagens")]
    public async Task<ActionResult<PagedResult<MensagemResponse>>> ListarMensagens(
        Guid id, [FromQuery] int pagina = 1, [FromQuery] int tamanhoPagina = 50)
    {
        return Ok(await _conversaService.ListarMensagensAsync(id, pagina, tamanhoPagina));
    }

    [HttpPost("{id:guid}/mensagens")]
    public async Task<ActionResult<MensagemResponse>> EnviarMensagem(Guid id, [FromBody] EnviarMensagemRequest request)
    {
        var resultado = await _conversaService.EnviarMensagemAsync(id, request);
        return StatusCode(StatusCodes.Status201Created, resultado);
    }

    [HttpPatch("{id:guid}/responsavel")]
    public async Task<ActionResult<ConversaResponse>> AtualizarResponsavel(Guid id, [FromBody] AtualizarResponsavelRequest request)
    {
        return Ok(await _conversaService.AtualizarResponsavelAsync(id, request));
    }

    [HttpPatch("{id:guid}/status")]
    public async Task<ActionResult<ConversaResponse>> AtualizarStatus(Guid id, [FromBody] AtualizarStatusConversaRequest request)
    {
        return Ok(await _conversaService.AtualizarStatusAsync(id, request));
    }
}
