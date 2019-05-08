using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net.Http;
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
        public readonly JwtOptions _jwtoptions;
        public readonly FacebookAuthSettings _facebookAuthSettings;
        private static readonly HttpClient Client = new HttpClient();

        public AccountController(UserManager<User> userManager, 
            IOptions<JwtOptions> jwtOptions,
            IOptions<FacebookAuthSettings> fbOpts)
        {
            _userManager = userManager;
            _jwtoptions = jwtOptions.Value;
            _facebookAuthSettings = fbOpts.Value;
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
                return Ok();
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
            if (User.Identity.IsAuthenticated)
            {
                return BadRequest("You are already logged in!");
            }

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userManager.FindByNameAsync(loginView.UserName);
            if (user != null)
            {
                var res = await _userManager.CheckPasswordAsync(user, loginView.Password);

                if (res)
                {
                    var jwt = await GenerateJwt(user);

                    return Ok(jwt);
                }

                ModelState.AddModelError("", "Invalid password");
                if (user.FacebookId != null)
                    ModelState.AddModelError("", "Your first sign in request was probably made by log in with FB button, so please try to login the same way");
            }
            else
            {
                ModelState.AddModelError("Errors", "User not found");
            }
            return BadRequest(ModelState);
        }

        [HttpPost("facebookLogin")]
        public async Task<IActionResult> Facebook([FromBody]FacebookViewModel model)
        {
            var appAccessTokenResponse = await Client.GetStringAsync
                ($"https://graph.facebook.com/oauth/access_token?client_id={_facebookAuthSettings.AppId}&client_secret={_facebookAuthSettings.AppSecret}&grant_type=client_credentials");
            var appAccessToken = JsonConvert.DeserializeObject<FacebookAppAccessToken>(appAccessTokenResponse);

            var userAccessTokenValidationResponse = await Client.GetStringAsync
                ($"https://graph.facebook.com/debug_token?input_token={model.AccessToken}&access_token={appAccessToken.AccessToken}");
            var userAccessTokenValidation = JsonConvert.DeserializeObject<FacebookUserAccessTokenValidation>(userAccessTokenValidationResponse);

            if(!userAccessTokenValidation.Data.IsValid)
            {
                ModelState.AddModelError("login_failure", "Invalid fb token");
                return BadRequest(ModelState);
            }

            var userInfoResponse = await Client.GetStringAsync
                ($"https://graph.facebook.com/v3.3/me?fields=id,email,first_name,last_name,name&access_token={model.AccessToken}");
            var userInfo = JsonConvert.DeserializeObject<FacebookUserData>(userInfoResponse);

            var user = await _userManager.FindByEmailAsync(userInfo.Email);

            if(user == null)
            {
                var appUser = new User
                {
                    Email = userInfo.Email,
                    UserName = userInfo.Email,
                    FirstName = userInfo.FirstName,
                    LastName = userInfo.LastName,
                    FacebookId = userInfo.Id
                };

                var result = await _userManager.CreateAsync(appUser, Convert.ToBase64String(Guid.NewGuid().ToByteArray()));

                if (!result.Succeeded)
                {
                    foreach (var item in result.Errors)
                    {
                        ModelState.AddModelError(item.Code, item.Description);
                    }
                }
            }

            var localUser = await _userManager.FindByNameAsync(userInfo.Email);

            if(localUser == null)
            {
                ModelState.AddModelError("login_failure", "Failed to create local user account");
                return BadRequest(ModelState);
            }

            var jwt = await GenerateJwt(localUser);

            return Ok(jwt);
        }

        private async Task<string> GenerateJwt(User user)
        {
            var val = _jwtoptions;
            var roles = await _userManager.GetRolesAsync(user);
            var claims = new List<Claim>();
            var now = DateTime.UtcNow;
            foreach (var item in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, item));
            }
            claims.Add(new Claim(ClaimTypes.Name, user.UserName));
            var tokenOptions = new JwtSecurityToken(
                    issuer: val.Issuer,
                    audience: val.Audience,
                    notBefore: now,
                    claims: claims,
                    expires: now.AddMinutes(20),
                    signingCredentials: val.SigningCredentials
            );

            return JsonConvert.SerializeObject(new ResponseModel { AuthToken = new JwtSecurityTokenHandler().WriteToken(tokenOptions) });
        }
    }
}
