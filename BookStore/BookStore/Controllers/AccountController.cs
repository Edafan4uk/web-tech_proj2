using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using BookStore.Helpers;
using BookStore.Helpers.Models;
using BookStore.ViewModels;
using DAL.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BookStore
{
    [Route("api/[controller]")]
    public class AccountController : Controller
    {
        public readonly UserManager<User> _userManager;
        public readonly IOptions<JwtOptions> _jwtoptions;

        public AccountController(UserManager<User> userManager, IOptions<JwtOptions> jwtOptions)
        {
            _userManager = userManager;
            _jwtoptions = jwtOptions;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegistrationViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userToRegister = new User
            {
                FirstName = model.FirstName,
                LastName = model.LastName,
                Email = model.Email,
                UserName = model.Email
            };

            var result = await _userManager.CreateAsync(userToRegister, model.Password);
            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(userToRegister, "User");
                return Ok("Account created");
            }
            foreach(var item in result.Errors)
            {
                ModelState.AddModelError(item.Code, item.Description);
            }
            return BadRequest(ModelState);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginViewMode loginView)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userManager.FindByNameAsync(loginView.UserName);
            if (user != null)
            {
                var res = await _userManager.CheckPasswordAsync(user, loginView.Password);

                if (res)
                {
                    var val = _jwtoptions.Value;
                    var roles = await _userManager.GetRolesAsync(user);
                    var claims = new List<Claim>();
                    foreach (var item in roles)
                    {
                        claims.Add(new Claim(ClaimTypes.Role, item));
                    }
                    var tokenOptions = new JwtSecurityToken(
                            issuer: val.Issuer,
                            audience: val.Audience,
                            signingCredentials: val.SigningCredentials,
                            expires:DateTime.Now.AddSeconds(20),
                            claims: claims
                        );

                    return Ok(JsonConvert.SerializeObject(new ResponseModel { AuthToken = new JwtSecurityTokenHandler().WriteToken(tokenOptions) }));
                }

                ModelState.AddModelError("", "Invalid password");
            }
            else
            {
                ModelState.AddModelError("Errors", "User not found");
            }
            return BadRequest(ModelState);
        }
    }
}
