using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.DTO_s
{
    public class BookDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public double Price { get; set; }
        public double? AmInStock { get; set; }
        public string AuthorName { get; set; }
        public bool CommentsActive { get; set; }
        public bool IsVisible { get; set; }
    }
}
