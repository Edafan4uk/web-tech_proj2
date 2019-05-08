using DAL.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Configurations
{
    public class CommentConfiguration : IEntityTypeConfiguration<Comment>
    {
        public void Configure(EntityTypeBuilder<Comment> builder)
        {
            builder.HasKey(c => c.Id);

            builder
                .Property(c => c.Content)
                .HasMaxLength(200)
                .IsRequired();

            builder
                .HasOne(c => c.Book)
                .WithMany(b => b.Comments)
                .HasForeignKey(b => b.BookId)
                .IsRequired();

            builder
                .HasOne(c => c.User)
                .WithMany(u => u.Comments)
                .HasForeignKey(c => c.UserId)
                .IsRequired();
        }
    }
}
