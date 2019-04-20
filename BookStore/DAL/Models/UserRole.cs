using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{
    public class UserRole:IdentityUserRole<int>
    {
        public User User { get; set; }
        public Role Role { get; set; }
    }
}
