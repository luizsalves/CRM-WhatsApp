using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WhatsCrm.Api.Entities;

namespace WhatsCrm.Api.Configurations;

public class ContatoConfiguration : IEntityTypeConfiguration<Contato>
{
    public void Configure(EntityTypeBuilder<Contato> builder)
    {
        builder.ToTable("contatos");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.Id).HasColumnName("id");
        builder.Property(c => c.EmpresaId).HasColumnName("empresa_id").IsRequired();
        builder.Property(c => c.Nome).HasColumnName("nome").HasMaxLength(200).IsRequired();
        builder.Property(c => c.Telefone).HasColumnName("telefone").HasMaxLength(20).IsRequired();
        builder.Property(c => c.Email).HasColumnName("email").HasMaxLength(200);
        builder.Property(c => c.DataNascimento).HasColumnName("data_nascimento");
        builder.Property(c => c.EmpresaNome).HasColumnName("empresa_nome").HasMaxLength(200);
        builder.Property(c => c.Observacoes).HasColumnName("observacoes");
        builder.Property(c => c.ResponsavelUsuarioId).HasColumnName("responsavel_usuario_id");
        builder.Property(c => c.CreatedAt).HasColumnName("created_at").IsRequired();
        builder.Property(c => c.UpdatedAt).HasColumnName("updated_at").IsRequired();

        builder.HasIndex(c => new { c.EmpresaId, c.Telefone }).IsUnique();

        builder.HasOne(c => c.Empresa)
            .WithMany()
            .HasForeignKey(c => c.EmpresaId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(c => c.ResponsavelUsuario)
            .WithMany()
            .HasForeignKey(c => c.ResponsavelUsuarioId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
