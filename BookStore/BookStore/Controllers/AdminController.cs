using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DAL.DTO_s;
using DAL.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Controllers
{
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : Controller
    {
        private readonly UserManager<User> _userManager;

        public AdminController(UserManager<User> manager)
        {
            _userManager = manager;
        }

        [HttpGet("usersWithRoles")]
        public async Task<IActionResult> GetUsersWithRoles()
        {
            var users = await _userManager.Users.ToListAsync();

            List<UserDTO> userDTOs = new List<UserDTO>();

            IList<string> roles;

            foreach (var item in users)
            {
                roles = await _userManager.GetRolesAsync(item);

                userDTOs.Add(new UserDTO
                {
                    Id = item.Id,
                    UserName = item.UserName,
                    Roles = roles
                });
            }

            return Ok(userDTOs);
        }

        [HttpPost("addToRoles")]
        public async Task<IActionResult> AddToRoles([FromBody] UserDTO model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userManager.FindByNameAsync(model.UserName);

            if(user == null)
            {
                ModelState.AddModelError("", $"Cannot find user with username: {model.UserName}");
                return NotFound(ModelState);
            }

            var userRoles = await _userManager.GetRolesAsync(user);

            var rolesToAdd = model.Roles.Except(userRoles);

            var rolesToRemove = userRoles.Except(model.Roles);

            var addRes = await _userManager.AddToRolesAsync(user, rolesToAdd);

            var remRes = await _userManager.RemoveFromRolesAsync(user, rolesToRemove);
            if (!(remRes.Succeeded&&addRes.Succeeded))
            {
                ModelState.AddModelError("failed_a_r", "something went wrong");
                return BadRequest(ModelState);
            }

            model.Roles = await _userManager.GetRolesAsync(user);

            return Ok(model);
        }
    }
}