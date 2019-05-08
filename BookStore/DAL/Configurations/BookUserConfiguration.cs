using DAL.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Configurations
{
    public class BookUserConfiguration : IEntityTypeConfiguration<BookUser>
    {
        public void Configure(EntityTypeBuilder<BookUser> builder)
        {
            builder.HasKey(bu => bu.Id);

            builder
                .HasOne(bu => bu.User)
                .WithMany(u => u.BookUsers)
                .HasForeignKey(bu => bu.UserId)
                .IsRequired();

            builder
                .HasOne(bu => bu.Book)
                .WithMany(u => u.BookUsers)
                .HasForeignKey(bu => bu.BookId)
                .IsRequired();

            builder
                .Property(bu => bu.Amount)
                .IsRequired();
        }
    }
}
