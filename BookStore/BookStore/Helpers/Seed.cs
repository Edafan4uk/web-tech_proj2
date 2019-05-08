using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.IO;
using DAL.Models;
using BookStore.ViewModels;

namespace BookStore
{
    public class Seed
    {
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<Role> _roleManager;

        public Seed(UserManager<User> userManager, RoleManager<Role> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public void SeedUsers()
        {
            if (!_userManager.Users.Any())
            {
                var userData = System.IO.File.ReadAllText(Path.Combine(Directory.GetCurrentDirectory().Split("\\bin\\Debug").First() + "\\Helpers", "UserSeedData.json"));
                var deserializeObjects = JsonConvert.DeserializeObject<List<RegistrationViewModel>>(userData);

                var list = new List<User>();
                foreach (var item in deserializeObjects)
                {
                    list.Add(new User
                    {
                        FirstName = item.FirstName,
                        LastName = item.LastName,
                        Email = item.Email,
                        UserName = item.Email
                    });
                }

                var roles = new List<Role>
                {
                    new Role{ Name = "Admin"},
                    new Role{ Name = "Moderator"}
                };

                foreach (var item in roles)
                {
                    _roleManager.CreateAsync(item).Wait();
                }

                for (int i = 0; i < list.Count; i++)
                {
                    var res = _userManager.CreateAsync(list[i], deserializeObjects[i].Password).Result;
                    if (res.Succeeded)
                        _userManager.AddToRoleAsync(list[i], "Moderator").Wait();
                }

                var admin = new User
                {
                    Email = "admin@gmail.com",
                    UserName = "admin@gmail.com",
                    FirstName = "Petro",
                    LastName = "Rebro"
                };

                IdentityResult result = _userManager.CreateAsync(admin, "password").Result;

                if (result.Succeeded)
                {
                    admin = _userManager.FindByNameAsync("admin@gmail.com").Result;

                    _userManager.AddToRoleAsync(admin, "Admin").Wait();
                }
            }

        }
    }
}
