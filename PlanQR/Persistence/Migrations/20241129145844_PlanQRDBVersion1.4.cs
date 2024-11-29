using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class PlanQRDBVersion14 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Messages_Chats_Chatid",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "roomId",
                table: "Lessons");

            migrationBuilder.RenameColumn(
                name: "Chatid",
                table: "Messages",
                newName: "chatID");

            migrationBuilder.RenameIndex(
                name: "IX_Messages_Chatid",
                table: "Messages",
                newName: "IX_Messages_chatID");

            migrationBuilder.RenameColumn(
                name: "type",
                table: "Lessons",
                newName: "lessonType");

            migrationBuilder.AlterColumn<Guid>(
                name: "chatID",
                table: "Messages",
                type: "TEXT",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "id",
                table: "Lessons",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "TEXT")
                .Annotation("Sqlite:Autoincrement", true);

            migrationBuilder.AddColumn<int>(
                name: "lessonID",
                table: "Chats",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Chats_lessonID",
                table: "Chats",
                column: "lessonID",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Chats_Lessons_lessonID",
                table: "Chats",
                column: "lessonID",
                principalTable: "Lessons",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_Chats_chatID",
                table: "Messages",
                column: "chatID",
                principalTable: "Chats",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Chats_Lessons_lessonID",
                table: "Chats");

            migrationBuilder.DropForeignKey(
                name: "FK_Messages_Chats_chatID",
                table: "Messages");

            migrationBuilder.DropIndex(
                name: "IX_Chats_lessonID",
                table: "Chats");

            migrationBuilder.DropColumn(
                name: "lessonID",
                table: "Chats");

            migrationBuilder.RenameColumn(
                name: "chatID",
                table: "Messages",
                newName: "Chatid");

            migrationBuilder.RenameIndex(
                name: "IX_Messages_chatID",
                table: "Messages",
                newName: "IX_Messages_Chatid");

            migrationBuilder.RenameColumn(
                name: "lessonType",
                table: "Lessons",
                newName: "type");

            migrationBuilder.AlterColumn<Guid>(
                name: "Chatid",
                table: "Messages",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "TEXT");

            migrationBuilder.AlterColumn<Guid>(
                name: "id",
                table: "Lessons",
                type: "TEXT",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER")
                .OldAnnotation("Sqlite:Autoincrement", true);

            migrationBuilder.AddColumn<Guid>(
                name: "roomId",
                table: "Lessons",
                type: "TEXT",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_Chats_Chatid",
                table: "Messages",
                column: "Chatid",
                principalTable: "Chats",
                principalColumn: "id");
        }
    }
}
