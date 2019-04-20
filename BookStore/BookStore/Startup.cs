using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BookStore.Helpers;
using DAL.Data;
using DAL.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace BookStore
{
    public class Startup
    {
        public readonly IConfiguration _configuration;

        public Startup(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<BookStoreContext>(opts =>
            {
                opts.UseSqlServer(_configuration.GetConnectionString("DefaultConnection"));
            });

            services.AddIdentity<User, Role>(opts =>
            {
                opts.Password.RequireDigit = false;
                opts.Password.RequiredLength = 8;

                opts.Password.RequireNonAlphanumeric = false;
                opts.Password.RequireLowercase = false;
                opts.Password.RequireUppercase = false;
            }).AddEntityFrameworkStores<BookStoreContext>();

            services.AddTransient<Seed>();


            var jwtopts = _configuration.GetSection("jwtoptions");
            var symmetricKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtopts["secretkey"]));

            services.Configure<JwtOptions>(opts =>
            {
                
                opts.Audience = jwtopts["audience"];
                opts.Issuer = jwtopts["issuer"];
                opts.SigningCredentials = new SigningCredentials(symmetricKey, SecurityAlgorithms.HmacSha256);
            });

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateIssuerSigningKey = true,
                        ValidateLifetime = false,

                        ValidIssuer = jwtopts["issuer"],
                        ValidAudience = jwtopts["audience"],
                        IssuerSigningKey = symmetricKey
                    };
                });

            services.AddMvc(opts =>
            {

            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, Seed seeder)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.Use(async (context, next) =>
            {
                await next();

                if (context.Response.StatusCode == 404 && !Path.HasExtension(context.Request.Path.Value) && !context.Request.Path.Value.StartsWith("/api/"))
                {
                    context.Request.Path = "/index.html/";
                    await next();
                }

            });
            app.UseMvcWithDefaultRoute();

            
            app.UseDefaultFiles();

            app.UseStaticFiles();
            seeder.SeedUsers();
            app.UseAuthentication();
            app.UseMvc();
            
        }
    }
}
