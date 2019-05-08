using Microsoft.EntityFrameworkCore.Migrations;

namespace DAL.Migrations
{
    public partial class notInit : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsVisibleInCatalog",
                table: "Books",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsVisibleInCatalog",
                table: "Books");
        }
    }
}
