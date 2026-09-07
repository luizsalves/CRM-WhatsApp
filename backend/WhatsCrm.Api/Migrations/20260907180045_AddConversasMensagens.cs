using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WhatsCrm.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddConversasMensagens : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "conversas",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    empresa_id = table.Column<Guid>(type: "uuid", nullable: false),
                    contato_id = table.Column<Guid>(type: "uuid", nullable: false),
                    whatsapp_conta_id = table.Column<Guid>(type: "uuid", nullable: false),
                    responsavel_usuario_id = table.Column<Guid>(type: "uuid", nullable: true),
                    status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    ultima_mensagem_em = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    ultima_mensagem_texto = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    quantidade_nao_lidas = table.Column<int>(type: "integer", nullable: false),
                    created_at = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_conversas", x => x.id);
                    table.ForeignKey(
                        name: "FK_conversas_contatos_contato_id",
                        column: x => x.contato_id,
                        principalTable: "contatos",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_conversas_usuarios_responsavel_usuario_id",
                        column: x => x.responsavel_usuario_id,
                        principalTable: "usuarios",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_conversas_whatsapp_contas_whatsapp_conta_id",
                        column: x => x.whatsapp_conta_id,
                        principalTable: "whatsapp_contas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "mensagens",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    empresa_id = table.Column<Guid>(type: "uuid", nullable: false),
                    conversa_id = table.Column<Guid>(type: "uuid", nullable: false),
                    provider_message_id = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    direcao = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    tipo = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    texto = table.Column<string>(type: "text", nullable: true),
                    status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    enviada_em = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    recebida_em = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    lida_em = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    created_at = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_mensagens", x => x.id);
                    table.ForeignKey(
                        name: "FK_mensagens_conversas_conversa_id",
                        column: x => x.conversa_id,
                        principalTable: "conversas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_conversas_contato_id_whatsapp_conta_id",
                table: "conversas",
                columns: new[] { "contato_id", "whatsapp_conta_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_conversas_empresa_id_ultima_mensagem_em",
                table: "conversas",
                columns: new[] { "empresa_id", "ultima_mensagem_em" });

            migrationBuilder.CreateIndex(
                name: "IX_conversas_responsavel_usuario_id",
                table: "conversas",
                column: "responsavel_usuario_id");

            migrationBuilder.CreateIndex(
                name: "IX_conversas_whatsapp_conta_id",
                table: "conversas",
                column: "whatsapp_conta_id");

            migrationBuilder.CreateIndex(
                name: "IX_mensagens_conversa_id_created_at",
                table: "mensagens",
                columns: new[] { "conversa_id", "created_at" });

            migrationBuilder.CreateIndex(
                name: "IX_mensagens_provider_message_id",
                table: "mensagens",
                column: "provider_message_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "mensagens");

            migrationBuilder.DropTable(
                name: "conversas");
        }
    }
}
