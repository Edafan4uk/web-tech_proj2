using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace BookStore.ViewModels
{
    public class CardItemViewModel
    {
        public int? Id { get; set; }
        public string BookName { get; set; }
        public string AuthorName { get; set; }
        public int BookId { get; set; }
        [Range(1,3, ErrorMessage = "Amount has to be in range : [1, 3]")]
        public int Amount { get; set; }
    }
}
