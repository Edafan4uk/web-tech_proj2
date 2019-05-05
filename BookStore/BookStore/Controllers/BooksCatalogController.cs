using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BookStore.Controllers
{
    [Route("api/[controller]")]
    public class BooksCatalogController : Controller
    {
        [Authorize]
        [HttpGet]
        public IActionResult Get()
        {
            return Ok();
        }
    }
}