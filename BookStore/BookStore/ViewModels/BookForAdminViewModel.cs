using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookStore.ViewModels
{
    public class BookForAdminViewModel
    {
        public int? Id { get; set; }
        public string Name { get; set; }
        public double Price { get; set; }
        public int? AmInStock { get; set; }
        public string AuthorName { get; set; }
        public bool CommentsActive { get; set; }
        public bool IsVisible { get; set; }
    }
}
