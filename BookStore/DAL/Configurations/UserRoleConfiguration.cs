using DAL.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DAL.Configurations
{
    public class UserRoleConfiguration : IEntityTypeConfiguration<UserRole>
    {
        public void Configure(EntityTypeBuilder<UserRole> builder)
        {

            builder.HasOne(ur => ur.User).WithMany(u => u.UserRoles).HasForeignKey(ur => ur.UserId)
                .IsRequired();

            builder.HasOne(ur => ur.Role).WithMany(u => u.UserRoles).HasForeignKey(ur => ur.RoleId)
                .IsRequired();
        }
    }
}
