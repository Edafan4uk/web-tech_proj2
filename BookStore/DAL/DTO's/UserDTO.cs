using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.DTO_s
{
    public class UserDTO
    {
        public int Id { get; set; }
        public IList<string> Roles { get; set; }
        public string UserName { get; set; }
    }
}
