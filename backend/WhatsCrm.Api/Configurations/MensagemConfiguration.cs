using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WhatsCrm.Api.Entities;

namespace WhatsCrm.Api.Configurations;

public class MensagemConfiguration : IEntityTypeConfiguration<Mensagem>
{
    public void Configure(EntityTypeBuilder<Mensagem> builder)
    {
        builder.ToTable("mensagens");

        builder.HasKey(m => m.Id);

        builder.Property(m => m.Id).HasColumnName("id");
        builder.Property(m => m.EmpresaId).HasColumnName("empresa_id").IsRequired();
        builder.Property(m => m.ConversaId).HasColumnName("conversa_id").IsRequired();
        builder.Property(m => m.ProviderMessageId).HasColumnName("provider_message_id").HasMaxLength(100);
        builder.Property(m => m.Direcao).HasColumnName("direcao").HasConversion<string>().HasMaxLength(10).IsRequired();
        builder.Property(m => m.Tipo).HasColumnName("tipo").HasConversion<string>().HasMaxLength(20).IsRequired();
        builder.Property(m => m.Texto).HasColumnName("texto");
        builder.Property(m => m.Status).HasColumnName("status").HasConversion<string>().HasMaxLength(20).IsRequired();
        builder.Property(m => m.EnviadaEm).HasColumnName("enviada_em");
        builder.Property(m => m.RecebidaEm).HasColumnName("recebida_em");
        builder.Property(m => m.LidaEm).HasColumnName("lida_em");
        builder.Property(m => m.CreatedAt).HasColumnName("created_at").IsRequired();

        builder.HasIndex(m => new { m.ConversaId, m.CreatedAt });
        builder.HasIndex(m => m.ProviderMessageId);

        builder.HasOne(m => m.Conversa)
            .WithMany(c => c.Mensagens)
            .HasForeignKey(m => m.ConversaId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
