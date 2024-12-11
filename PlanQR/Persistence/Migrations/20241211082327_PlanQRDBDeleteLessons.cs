using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class PlanQRDBDeleteLessons : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Chats_Lessons_lessonID",
                table: "Chats");

            migrationBuilder.DropTable(
                name: "Lessons");

            migrationBuilder.DropIndex(
                name: "IX_Chats_lessonID",
                table: "Chats");

            migrationBuilder.DropColumn(
                name: "lessonID",
                table: "Chats");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "lessonID",
                table: "Chats",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Lessons",
                columns: table => new
                {
                    id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    degreeType = table.Column<string>(type: "TEXT", nullable: true),
                    description = table.Column<string>(type: "TEXT", nullable: true),
                    end = table.Column<DateTime>(type: "TEXT", nullable: false),
                    faculty = table.Column<string>(type: "TEXT", nullable: true),
                    fieldStudies = table.Column<string>(type: "TEXT", nullable: true),
                    lecturer = table.Column<string>(type: "TEXT", nullable: true),
                    lessonType = table.Column<string>(type: "TEXT", nullable: true),
                    room = table.Column<string>(type: "TEXT", nullable: true),
                    semester = table.Column<int>(type: "INTEGER", nullable: false),
                    speciality = table.Column<string>(type: "TEXT", nullable: true),
                    start = table.Column<DateTime>(type: "TEXT", nullable: false),
                    subject = table.Column<string>(type: "TEXT", nullable: true),
                    typeShort = table.Column<string>(type: "TEXT", nullable: true),
                    typeStudy = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Lessons", x => x.id);
                });

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
        }
    }
}
