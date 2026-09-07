namespace WhatsCrm.Api.Entities;

public class ContatoTag
{
    public Guid ContatoId { get; set; }
    public Guid TagId { get; set; }

    public Contato Contato { get; set; } = null!;
    public Tag Tag { get; set; } = null!;
}
