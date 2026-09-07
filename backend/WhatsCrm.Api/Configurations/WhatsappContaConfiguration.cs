using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WhatsCrm.Api.Entities;

namespace WhatsCrm.Api.Configurations;

public class WhatsappContaConfiguration : IEntityTypeConfiguration<WhatsappConta>
{
    public void Configure(EntityTypeBuilder<WhatsappConta> builder)
    {
        builder.ToTable("whatsapp_contas");

        builder.HasKey(w => w.Id);

        builder.Property(w => w.Id).HasColumnName("id");
        builder.Property(w => w.EmpresaId).HasColumnName("empresa_id").IsRequired();
        builder.Property(w => w.PhoneNumberId).HasColumnName("phone_number_id").HasMaxLength(50).IsRequired();
        builder.Property(w => w.WabaId).HasColumnName("waba_id").HasMaxLength(50).IsRequired();
        builder.Property(w => w.NumeroExibicao).HasColumnName("numero_exibicao").HasMaxLength(30).IsRequired();
        builder.Property(w => w.AccessTokenCriptografado).HasColumnName("access_token_criptografado").IsRequired();
        builder.Property(w => w.Ativo).HasColumnName("ativo").IsRequired();
        builder.Property(w => w.CreatedAt).HasColumnName("created_at").IsRequired();
        builder.Property(w => w.UpdatedAt).HasColumnName("updated_at").IsRequired();

        builder.HasIndex(w => w.PhoneNumberId).IsUnique();
        builder.HasIndex(w => w.EmpresaId);

        builder.HasOne(w => w.Empresa)
            .WithMany()
            .HasForeignKey(w => w.EmpresaId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
