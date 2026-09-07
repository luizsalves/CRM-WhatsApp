using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WhatsCrm.Api.DTOs;
using WhatsCrm.Api.Interfaces;

namespace WhatsCrm.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/contatos")]
public class ContatosController : ControllerBase
{
    private readonly IContatoService _contatoService;

    public ContatosController(IContatoService contatoService)
    {
        _contatoService = contatoService;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResult<ContatoResponse>>> Listar(
        [FromQuery] string? busca, [FromQuery] int pagina = 1, [FromQuery] int tamanhoPagina = 20)
    {
        return Ok(await _contatoService.ListarAsync(busca, pagina, tamanhoPagina));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ContatoResponse>> ObterPorId(Guid id)
    {
        return Ok(await _contatoService.ObterPorIdAsync(id));
    }

    [HttpPost]
    public async Task<ActionResult<ContatoResponse>> Criar([FromBody] CreateContatoRequest request)
    {
        var resultado = await _contatoService.CriarAsync(request);
        return StatusCode(StatusCodes.Status201Created, resultado);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ContatoResponse>> Atualizar(Guid id, [FromBody] UpdateContatoRequest request)
    {
        return Ok(await _contatoService.AtualizarAsync(id, request));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Excluir(Guid id)
    {
        await _contatoService.ExcluirAsync(id);
        return NoContent();
    }

    [HttpPost("{id:guid}/tags/{tagId:guid}")]
    public async Task<ActionResult<ContatoResponse>> AdicionarTag(Guid id, Guid tagId)
    {
        return Ok(await _contatoService.AdicionarTagAsync(id, tagId));
    }

    [HttpDelete("{id:guid}/tags/{tagId:guid}")]
    public async Task<ActionResult<ContatoResponse>> RemoverTag(Guid id, Guid tagId)
    {
        return Ok(await _contatoService.RemoverTagAsync(id, tagId));
    }
}
