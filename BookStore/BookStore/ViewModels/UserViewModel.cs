using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookStore.ViewModels
{
    public class UserViewModel
    {
        public int Id { get; set; }
        public IList<string> Roles { get; set; }
        public string UserName { get; set; }
    }
}
