namespace WhatsCrm.Api.Entities;

public class Tag
{
    public Guid Id { get; set; }
    public Guid EmpresaId { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Cor { get; set; } = "#128C7E";
    public DateTimeOffset CreatedAt { get; set; }

    public Empresa Empresa { get; set; } = null!;
    public ICollection<ContatoTag> ContatoTags { get; set; } = new List<ContatoTag>();
}
