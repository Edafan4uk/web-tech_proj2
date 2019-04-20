using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace BookStore.ViewModels
{
    public class RegistrationViewModel
    {
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        [Required]
        public string Email { get; set; }
        [Required(ErrorMessage ="Required length: 8 characters")]
        public string Password { get; set; }
        [Compare("Password",ErrorMessage ="Passwords do not match")]
        public string ConfirmPassword { get; set; }
    }
}
