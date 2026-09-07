using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WhatsCrm.Api.DTOs;
using WhatsCrm.Api.Interfaces;

namespace WhatsCrm.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/tags")]
public class TagsController : ControllerBase
{
    private readonly ITagService _tagService;

    public TagsController(ITagService tagService)
    {
        _tagService = tagService;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<TagResponse>>> Listar()
    {
        return Ok(await _tagService.ListarAsync());
    }

    [HttpPost]
    public async Task<ActionResult<TagResponse>> Criar([FromBody] CreateTagRequest request)
    {
        var resultado = await _tagService.CriarAsync(request);
        return StatusCode(StatusCodes.Status201Created, resultado);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<TagResponse>> Atualizar(Guid id, [FromBody] UpdateTagRequest request)
    {
        return Ok(await _tagService.AtualizarAsync(id, request));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Excluir(Guid id)
    {
        await _tagService.ExcluirAsync(id);
        return NoContent();
    }
}
