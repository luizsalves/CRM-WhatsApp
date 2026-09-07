using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WhatsCrm.Api.Entities;

namespace WhatsCrm.Api.Configurations;

public class ConversaConfiguration : IEntityTypeConfiguration<Conversa>
{
    public void Configure(EntityTypeBuilder<Conversa> builder)
    {
        builder.ToTable("conversas");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.Id).HasColumnName("id");
        builder.Property(c => c.EmpresaId).HasColumnName("empresa_id").IsRequired();
        builder.Property(c => c.ContatoId).HasColumnName("contato_id").IsRequired();
        builder.Property(c => c.WhatsappContaId).HasColumnName("whatsapp_conta_id").IsRequired();
        builder.Property(c => c.ResponsavelUsuarioId).HasColumnName("responsavel_usuario_id");
        builder.Property(c => c.Status).HasColumnName("status").HasConversion<string>().HasMaxLength(20).IsRequired();
        builder.Property(c => c.UltimaMensagemEm).HasColumnName("ultima_mensagem_em").IsRequired();
        builder.Property(c => c.UltimaMensagemTexto).HasColumnName("ultima_mensagem_texto").HasMaxLength(200);
        builder.Property(c => c.QuantidadeNaoLidas).HasColumnName("quantidade_nao_lidas").IsRequired();
        builder.Property(c => c.CreatedAt).HasColumnName("created_at").IsRequired();
        builder.Property(c => c.UpdatedAt).HasColumnName("updated_at").IsRequired();

        builder.HasIndex(c => new { c.EmpresaId, c.UltimaMensagemEm });
        builder.HasIndex(c => new { c.ContatoId, c.WhatsappContaId }).IsUnique();

        builder.HasOne(c => c.Contato)
            .WithMany()
            .HasForeignKey(c => c.ContatoId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(c => c.WhatsappConta)
            .WithMany()
            .HasForeignKey(c => c.WhatsappContaId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(c => c.ResponsavelUsuario)
            .WithMany()
            .HasForeignKey(c => c.ResponsavelUsuarioId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
