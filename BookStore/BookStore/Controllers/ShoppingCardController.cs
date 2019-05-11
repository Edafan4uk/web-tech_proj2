using DAL.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace BookStore.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    public class ShoppingCardController : Controller
    {
        private readonly BookStoreContext _context;

        public ShoppingCardController(BookStoreContext context)
        {
            _context = context;
        }

        //[HttpGet("shoppingCard")]
        //public async Task<IActionResult> ShoppingCard()
        //{

        //}

    }
}