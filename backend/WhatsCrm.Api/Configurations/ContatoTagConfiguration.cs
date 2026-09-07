using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WhatsCrm.Api.Entities;

namespace WhatsCrm.Api.Configurations;

public class ContatoTagConfiguration : IEntityTypeConfiguration<ContatoTag>
{
    public void Configure(EntityTypeBuilder<ContatoTag> builder)
    {
        builder.ToTable("contato_tags");

        builder.HasKey(ct => new { ct.ContatoId, ct.TagId });

        builder.Property(ct => ct.ContatoId).HasColumnName("contato_id");
        builder.Property(ct => ct.TagId).HasColumnName("tag_id");

        builder.HasOne(ct => ct.Contato)
            .WithMany(c => c.ContatoTags)
            .HasForeignKey(ct => ct.ContatoId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(ct => ct.Tag)
            .WithMany(t => t.ContatoTags)
            .HasForeignKey(ct => ct.TagId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
