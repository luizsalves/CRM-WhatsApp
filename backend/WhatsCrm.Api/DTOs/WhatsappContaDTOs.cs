using System.ComponentModel.DataAnnotations;

namespace WhatsCrm.Api.DTOs;

public class CreateWhatsappContaRequest
{
    [Required(ErrorMessage = "O Phone Number ID é obrigatório.")]
    [MaxLength(50)]
    public string PhoneNumberId { get; set; } = string.Empty;

    [Required(ErrorMessage = "O WABA ID é obrigatório.")]
    [MaxLength(50)]
    public string WabaId { get; set; } = string.Empty;

    [Required(ErrorMessage = "O número de exibição é obrigatório.")]
    [MaxLength(30)]
    public string NumeroExibicao { get; set; } = string.Empty;

    [Required(ErrorMessage = "O token de acesso é obrigatório.")]
    public string AccessToken { get; set; } = string.Empty;
}

public class WhatsappContaResponse
{
    public Guid Id { get; set; }
    public string PhoneNumberId { get; set; } = string.Empty;
    public string WabaId { get; set; } = string.Empty;
    public string NumeroExibicao { get; set; } = string.Empty;
    public bool Ativo { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
}
