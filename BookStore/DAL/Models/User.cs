using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{
    public class User:IdentityUser<int>
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public long? FacebookId { get; set; }
        public ICollection<UserRole> UserRoles { get; set; }
    }
}
