using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WhatsCrm.Api.Entities;

namespace WhatsCrm.Api.Configurations;

public class UsuarioConfiguration : IEntityTypeConfiguration<Usuario>
{
    public void Configure(EntityTypeBuilder<Usuario> builder)
    {
        builder.ToTable("usuarios");

        builder.HasKey(u => u.Id);

        builder.Property(u => u.Id).HasColumnName("id");
        builder.Property(u => u.EmpresaId).HasColumnName("empresa_id").IsRequired();
        builder.Property(u => u.Nome).HasColumnName("nome").HasMaxLength(200).IsRequired();
        builder.Property(u => u.Email).HasColumnName("email").HasMaxLength(200).IsRequired();
        builder.Property(u => u.SenhaHash).HasColumnName("senha_hash").HasMaxLength(200).IsRequired();
        builder.Property(u => u.Role)
            .HasColumnName("role")
            .HasConversion<string>()
            .HasMaxLength(30)
            .IsRequired();
        builder.Property(u => u.Ativo).HasColumnName("ativo").IsRequired();
        builder.Property(u => u.UltimoLoginEm).HasColumnName("ultimo_login_em");
        builder.Property(u => u.CreatedAt).HasColumnName("created_at").IsRequired();
        builder.Property(u => u.UpdatedAt).HasColumnName("updated_at").IsRequired();

        // Único globalmente: o login não seleciona empresa, apenas email/senha,
        // então o email precisa identificar um único usuário em todo o sistema.
        builder.HasIndex(u => u.Email).IsUnique();
        builder.HasIndex(u => u.EmpresaId);

        builder.HasOne(u => u.Empresa)
            .WithMany(e => e.Usuarios)
            .HasForeignKey(u => u.EmpresaId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
