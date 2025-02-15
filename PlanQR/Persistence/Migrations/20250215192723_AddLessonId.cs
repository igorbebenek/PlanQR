using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddLessonId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "content",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "date",
                table: "Messages");

            migrationBuilder.RenameColumn(
                name: "roomId",
                table: "Messages",
                newName: "createdAt");

            migrationBuilder.AddColumn<int>(
                name: "lessonId",
                table: "Messages",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "lessonId",
                table: "Chats",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "lessonId",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "lessonId",
                table: "Chats");

            migrationBuilder.RenameColumn(
                name: "createdAt",
                table: "Messages",
                newName: "roomId");

            migrationBuilder.AddColumn<string>(
                name: "content",
                table: "Messages",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "date",
                table: "Messages",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }
    }
}
