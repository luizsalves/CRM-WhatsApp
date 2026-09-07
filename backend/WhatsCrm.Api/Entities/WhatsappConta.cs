namespace WhatsCrm.Api.Entities;

public class WhatsappConta
{
    public Guid Id { get; set; }
    public Guid EmpresaId { get; set; }
    public string PhoneNumberId { get; set; } = string.Empty;
    public string WabaId { get; set; } = string.Empty;
    public string NumeroExibicao { get; set; } = string.Empty;
    public string AccessTokenCriptografado { get; set; } = string.Empty;
    public bool Ativo { get; set; } = true;
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public Empresa Empresa { get; set; } = null!;
}
