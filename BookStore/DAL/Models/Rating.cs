using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{
    public class Rating
    {
        public int Id { get; set; }
        public int BookId { get; set; }
        public Book Book { get; set; }
        public double Num { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
    }
}
