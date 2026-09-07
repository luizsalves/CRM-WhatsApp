using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WhatsCrm.Api.Entities;

namespace WhatsCrm.Api.Configurations;

public class WebhookEventoConfiguration : IEntityTypeConfiguration<WebhookEvento>
{
    public void Configure(EntityTypeBuilder<WebhookEvento> builder)
    {
        builder.ToTable("webhook_eventos");

        builder.HasKey(w => w.Id);

        builder.Property(w => w.Id).HasColumnName("id");
        builder.Property(w => w.EmpresaId).HasColumnName("empresa_id");
        builder.Property(w => w.WhatsappContaId).HasColumnName("whatsapp_conta_id");
        builder.Property(w => w.ProviderEventId).HasColumnName("provider_event_id").HasMaxLength(100).IsRequired();
        builder.Property(w => w.Tipo).HasColumnName("tipo").HasConversion<string>().HasMaxLength(30).IsRequired();
        builder.Property(w => w.Payload).HasColumnName("payload").HasColumnType("jsonb").IsRequired();
        builder.Property(w => w.Processado).HasColumnName("processado").IsRequired();
        builder.Property(w => w.CreatedAt).HasColumnName("created_at").IsRequired();
        builder.Property(w => w.ProcessedAt).HasColumnName("processed_at");

        builder.HasIndex(w => w.ProviderEventId).IsUnique();
    }
}
