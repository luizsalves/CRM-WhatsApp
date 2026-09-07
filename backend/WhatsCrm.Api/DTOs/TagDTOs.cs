using System.ComponentModel.DataAnnotations;

namespace WhatsCrm.Api.DTOs;

public class CreateTagRequest
{
    [Required(ErrorMessage = "O nome da tag é obrigatório.")]
    [MaxLength(60)]
    public string Nome { get; set; } = string.Empty;

    [Required(ErrorMessage = "A cor é obrigatória.")]
    [RegularExpression(@"^#[0-9A-Fa-f]{6}$", ErrorMessage = "Cor deve estar no formato hexadecimal, ex.: #128C7E.")]
    public string Cor { get; set; } = "#128C7E";
}

public class UpdateTagRequest : CreateTagRequest
{
}
