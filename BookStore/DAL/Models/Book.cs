using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{
    public class Book
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public double Price { get; set; }
        public int AuthorId { get; set; }
        public Author Author { get; set; }
        public int AmInStock { get; set; }
        public ICollection<BookUser> BookUsers { get; set; }
        public bool CommentsActive { get; set; }
        public ICollection<Comment> Comments { get; set; }
        public ICollection<Rating> Ratings { get; set; }
        public bool IsVisibleInCatalog { get; set; }
    }
}
