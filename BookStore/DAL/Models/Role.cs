using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{
    public class Role:IdentityRole<int>
    {
        public ICollection<UserRole> UserRoles { get; set; }
    }
}
