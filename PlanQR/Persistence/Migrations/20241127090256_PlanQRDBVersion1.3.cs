using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class PlanQRDBVersion13 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Lessons_Chats_chatid",
                table: "Lessons");

            migrationBuilder.DropIndex(
                name: "IX_Lessons_chatid",
                table: "Lessons");

            migrationBuilder.DropColumn(
                name: "chatid",
                table: "Lessons");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "chatid",
                table: "Lessons",
                type: "TEXT",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Lessons_chatid",
                table: "Lessons",
                column: "chatid");

            migrationBuilder.AddForeignKey(
                name: "FK_Lessons_Chats_chatid",
                table: "Lessons",
                column: "chatid",
                principalTable: "Chats",
                principalColumn: "id");
        }
    }
}
