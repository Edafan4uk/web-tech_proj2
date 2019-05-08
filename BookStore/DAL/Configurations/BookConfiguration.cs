using DAL.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Configurations
{
    public class BookConfiguration : IEntityTypeConfiguration<Book>
    {
        public void Configure(EntityTypeBuilder<Book> builder)
        {
            builder.HasKey(b => b.Id);

            builder
                .Property(b => b.Name)
                .HasMaxLength(50)
                .IsRequired();

            builder
                .Property(b => b.AmInStock)
                .HasDefaultValue(0)
                .IsRequired();

            builder
                .Property(b => b.Price)
                .IsRequired();

            builder
                .HasOne(b => b.Author)
                .WithMany(a => a.Books)
                .HasForeignKey(b => b.AuthorId)
                .IsRequired();

            builder
                 .Property(b => b.CommentsActive)
                 .IsRequired();

            builder
                .Property(b => b.IsVisibleInCatalog)
                .IsRequired();
        }
    }
}
