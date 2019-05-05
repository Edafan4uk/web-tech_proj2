using System;
using System.IO;
using System.Text;
using BookStore.Helpers;
using DAL.Data;
using DAL.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SpaServices;
using Microsoft.AspNetCore.SpaServices.AngularCli;
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
            }).AddEntityFrameworkStores<BookStoreContext>()
            .AddDefaultTokenProviders();

            services.AddTransient<Seed>();


            var jwtopts = _configuration.GetSection("jwtoptions");
            var symmetricKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtopts["secretkey"]));

            services.Configure<JwtOptions>(opts =>
            {
                
                opts.Audience = jwtopts["audience"];
                opts.Issuer = jwtopts["issuer"];
                opts.SigningCredentials = new SigningCredentials(symmetricKey, SecurityAlgorithms.HmacSha256);
            });

            services.Configure<FacebookAuthSettings>(opts =>
            {
                var fbSett = _configuration.GetSection("FacebookSet");

                opts.AppId = fbSett["AppId"];
                opts.AppSecret = fbSett["AppSecret"];
            });

            services.AddAuthentication(opts=> {
                opts.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                opts.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                opts.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;

            })
            .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidIssuer = jwtopts["issuer"],

                        ValidateAudience = true,
                        ValidAudience = jwtopts["audience"],

                        ValidateLifetime = true,

                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = symmetricKey,

                        ClockSkew = TimeSpan.Zero
                    };
                });


            services.AddMvc(opts =>
            {

            });

            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "BookStoreClient";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, Seed seeder)
        {            
            app.UseDefaultFiles();
            app.UseStaticFiles();
            seeder.SeedUsers();
            app.UseAuthentication();
            app.UseSpaStaticFiles();
            app.UseMvc();
            app.UseSpa(configuration =>
            {
                configuration.Options.SourcePath = "BookStoreClient";
                if (env.IsDevelopment())
                {
                    configuration.UseAngularCliServer(npmScript: "start");
                }
            });                      
        }
    }
}
