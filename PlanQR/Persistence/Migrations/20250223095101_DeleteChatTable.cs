using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class DeleteChatTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Messages_Chats_chatID",
                table: "Messages");

            migrationBuilder.DropTable(
                name: "Chats");

            migrationBuilder.DropIndex(
                name: "IX_Messages_chatID",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "chatID",
                table: "Messages");

            migrationBuilder.AddColumn<string>(
                name: "body",
                table: "Messages",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "group",
                table: "Messages",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "login",
                table: "Messages",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "body",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "group",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "login",
                table: "Messages");

            migrationBuilder.AddColumn<int>(
                name: "chatID",
                table: "Messages",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Chats",
                columns: table => new
                {
                    id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    lessonId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Chats", x => x.id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Messages_chatID",
                table: "Messages",
                column: "chatID");

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_Chats_chatID",
                table: "Messages",
                column: "chatID",
                principalTable: "Chats",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
