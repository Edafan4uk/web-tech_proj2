using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using BookStore.Helpers.Models;
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
        public async Task<IActionResult> GetUsersWithRoles(ForTableModel model)
        {
            var propInfo = GetPropertyInfo(model.SortColumn);

            var nn = User.Identity.Name;
            var usersList = _userManager.Users.Where(u=>u.UserName!=User.Identity.Name);

           

            if (model.SearchTerm != null)
            {
                usersList = usersList.Where(u => u.UserName.Contains(model.SearchTerm));
            }

            switch (model.SortDirection)
            {
                case "asc":
                     usersList = propInfo != null ? 
                        usersList.OrderBy(u => propInfo.GetValue(u)):usersList.OrderBy(u=>u.Id);
                     break;
                case "desc":
                    usersList = propInfo != null?
                        usersList.OrderByDescending(u => propInfo.GetValue(u)):usersList.OrderByDescending(u=>u.Id);
                    break;
                default:
                    usersList = propInfo == null ?
                        usersList : usersList.OrderBy(u => propInfo.GetValue(u));
                    break;
            }
            var users = await usersList
                .Skip((model.Page - 1) * model.PageSize)
                .Take(model.PageSize)
                .ToListAsync();

            var total = await usersList.CountAsync();

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

            return Ok(new
            {
                entities = userDTOs,
                total
            });
        }

        [HttpPost("addToRoles")]
        public async Task<IActionResult> AddToRoles([FromBody] UserDTO model)
        {
            if(model.UserName == User.Identity.Name)
            {
                return BadRequest("You cannot modify you own claims!");
            }

            if(model.Roles.Any(r=>r == "Admin"))
            {
                return StatusCode(403, "You cannot asign user role claim 'Admin'");
            }

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

            if(await _userManager.IsInRoleAsync(user, "Admin"))
            {
                return StatusCode(403, "You cannot modify roles for users with 'Admin' role claim!"); 
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
        private PropertyInfo GetPropertyInfo(string columnName)
        {
            columnName = columnName ?? "Id";
            var type = typeof(User);
            return type.GetProperty(columnName);
        }
    }
}