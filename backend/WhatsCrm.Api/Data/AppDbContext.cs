using Microsoft.EntityFrameworkCore;
using WhatsCrm.Api.Entities;

namespace WhatsCrm.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Empresa> Empresas => Set<Empresa>();
    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Contato> Contatos => Set<Contato>();
    public DbSet<Tag> Tags => Set<Tag>();
    public DbSet<ContatoTag> ContatoTags => Set<ContatoTag>();
    public DbSet<WhatsappConta> WhatsappContas => Set<WhatsappConta>();
    public DbSet<WebhookEvento> WebhookEventos => Set<WebhookEvento>();
    public DbSet<Conversa> Conversas => Set<Conversa>();
    public DbSet<Mensagem> Mensagens => Set<Mensagem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
}
