using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class PlanQRDBVersion12 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "RoomId",
                table: "Messages",
                newName: "roomId");

            migrationBuilder.RenameColumn(
                name: "Room",
                table: "Messages",
                newName: "room");

            migrationBuilder.RenameColumn(
                name: "Lecturer",
                table: "Messages",
                newName: "lecturer");

            migrationBuilder.RenameColumn(
                name: "Date",
                table: "Messages",
                newName: "date");

            migrationBuilder.RenameColumn(
                name: "Content",
                table: "Messages",
                newName: "content");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Messages",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "Type",
                table: "Lessons",
                newName: "type");

            migrationBuilder.RenameColumn(
                name: "Subject",
                table: "Lessons",
                newName: "subject");

            migrationBuilder.RenameColumn(
                name: "RoomId",
                table: "Lessons",
                newName: "roomId");

            migrationBuilder.RenameColumn(
                name: "Room",
                table: "Lessons",
                newName: "room");

            migrationBuilder.RenameColumn(
                name: "Lecturer",
                table: "Lessons",
                newName: "lecturer");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Lessons",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "Date",
                table: "Lessons",
                newName: "start");

            migrationBuilder.RenameColumn(
                name: "Building",
                table: "Lessons",
                newName: "typeStudy");

            migrationBuilder.AddColumn<Guid>(
                name: "Chatid",
                table: "Messages",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "chatid",
                table: "Lessons",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "degreeType",
                table: "Lessons",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "description",
                table: "Lessons",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "end",
                table: "Lessons",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "faculty",
                table: "Lessons",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "fieldStudies",
                table: "Lessons",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "semester",
                table: "Lessons",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "speciality",
                table: "Lessons",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "typeShort",
                table: "Lessons",
                type: "TEXT",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Chats",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Chats", x => x.id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Messages_Chatid",
                table: "Messages",
                column: "Chatid");

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

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_Chats_Chatid",
                table: "Messages",
                column: "Chatid",
                principalTable: "Chats",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Lessons_Chats_chatid",
                table: "Lessons");

            migrationBuilder.DropForeignKey(
                name: "FK_Messages_Chats_Chatid",
                table: "Messages");

            migrationBuilder.DropTable(
                name: "Chats");

            migrationBuilder.DropIndex(
                name: "IX_Messages_Chatid",
                table: "Messages");

            migrationBuilder.DropIndex(
                name: "IX_Lessons_chatid",
                table: "Lessons");

            migrationBuilder.DropColumn(
                name: "Chatid",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "chatid",
                table: "Lessons");

            migrationBuilder.DropColumn(
                name: "degreeType",
                table: "Lessons");

            migrationBuilder.DropColumn(
                name: "description",
                table: "Lessons");

            migrationBuilder.DropColumn(
                name: "end",
                table: "Lessons");

            migrationBuilder.DropColumn(
                name: "faculty",
                table: "Lessons");

            migrationBuilder.DropColumn(
                name: "fieldStudies",
                table: "Lessons");

            migrationBuilder.DropColumn(
                name: "semester",
                table: "Lessons");

            migrationBuilder.DropColumn(
                name: "speciality",
                table: "Lessons");

            migrationBuilder.DropColumn(
                name: "typeShort",
                table: "Lessons");

            migrationBuilder.RenameColumn(
                name: "roomId",
                table: "Messages",
                newName: "RoomId");

            migrationBuilder.RenameColumn(
                name: "room",
                table: "Messages",
                newName: "Room");

            migrationBuilder.RenameColumn(
                name: "lecturer",
                table: "Messages",
                newName: "Lecturer");

            migrationBuilder.RenameColumn(
                name: "date",
                table: "Messages",
                newName: "Date");

            migrationBuilder.RenameColumn(
                name: "content",
                table: "Messages",
                newName: "Content");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Messages",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "type",
                table: "Lessons",
                newName: "Type");

            migrationBuilder.RenameColumn(
                name: "subject",
                table: "Lessons",
                newName: "Subject");

            migrationBuilder.RenameColumn(
                name: "roomId",
                table: "Lessons",
                newName: "RoomId");

            migrationBuilder.RenameColumn(
                name: "room",
                table: "Lessons",
                newName: "Room");

            migrationBuilder.RenameColumn(
                name: "lecturer",
                table: "Lessons",
                newName: "Lecturer");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Lessons",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "typeStudy",
                table: "Lessons",
                newName: "Building");

            migrationBuilder.RenameColumn(
                name: "start",
                table: "Lessons",
                newName: "Date");
        }
    }
}
