using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WhatsCrm.Api.Entities;

namespace WhatsCrm.Api.Configurations;

public class EmpresaConfiguration : IEntityTypeConfiguration<Empresa>
{
    public void Configure(EntityTypeBuilder<Empresa> builder)
    {
        builder.ToTable("empresas");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id).HasColumnName("id");
        builder.Property(e => e.Nome).HasColumnName("nome").HasMaxLength(200).IsRequired();
        builder.Property(e => e.NomeFantasia).HasColumnName("nome_fantasia").HasMaxLength(200);
        builder.Property(e => e.Cnpj).HasColumnName("cnpj").HasMaxLength(20);
        builder.Property(e => e.TipoNegocio)
            .HasColumnName("tipo_negocio")
            .HasConversion<string>()
            .HasMaxLength(30)
            .IsRequired();
        builder.Property(e => e.Ativo).HasColumnName("ativo").IsRequired();
        builder.Property(e => e.CreatedAt).HasColumnName("created_at").IsRequired();
        builder.Property(e => e.UpdatedAt).HasColumnName("updated_at").IsRequired();

        builder.HasIndex(e => e.Cnpj).IsUnique().HasFilter("cnpj IS NOT NULL");
    }
}
