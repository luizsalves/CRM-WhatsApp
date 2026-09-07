using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WhatsCrm.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddWhatsappIntegracao : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "webhook_eventos",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    empresa_id = table.Column<Guid>(type: "uuid", nullable: true),
                    whatsapp_conta_id = table.Column<Guid>(type: "uuid", nullable: true),
                    provider_event_id = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    tipo = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    payload = table.Column<string>(type: "jsonb", nullable: false),
                    processado = table.Column<bool>(type: "boolean", nullable: false),
                    created_at = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    processed_at = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_webhook_eventos", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "whatsapp_contas",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    empresa_id = table.Column<Guid>(type: "uuid", nullable: false),
                    phone_number_id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    waba_id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    numero_exibicao = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    access_token_criptografado = table.Column<string>(type: "text", nullable: false),
                    ativo = table.Column<bool>(type: "boolean", nullable: false),
                    created_at = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_whatsapp_contas", x => x.id);
                    table.ForeignKey(
                        name: "FK_whatsapp_contas_empresas_empresa_id",
                        column: x => x.empresa_id,
                        principalTable: "empresas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_webhook_eventos_provider_event_id",
                table: "webhook_eventos",
                column: "provider_event_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_whatsapp_contas_empresa_id",
                table: "whatsapp_contas",
                column: "empresa_id");

            migrationBuilder.CreateIndex(
                name: "IX_whatsapp_contas_phone_number_id",
                table: "whatsapp_contas",
                column: "phone_number_id",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "webhook_eventos");

            migrationBuilder.DropTable(
                name: "whatsapp_contas");
        }
    }
}
