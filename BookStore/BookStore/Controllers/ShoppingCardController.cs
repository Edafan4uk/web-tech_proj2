using BookStore.ViewModels;
using DAL.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System;
using DAL.Models;
using Microsoft.AspNetCore.Identity;
using AutoMapper;
using System.Linq;
using System.Collections.Generic;

namespace BookStore.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    public class ShoppingCardController : Controller
    {
        private readonly BookStoreContext _context;
        private readonly UserManager<User> _userManager;
        private readonly IMapper _mapper;

        public ShoppingCardController(BookStoreContext context, UserManager<User> manager, IMapper mapper)
        {
            _context = context;
            _userManager = manager;
            _mapper = mapper;
        }

        [HttpGet("myCard")]
        public async Task<IActionResult> Card()
        {
            var userBooks = await _context.BookUsers
                .Include(bu => bu.Book)
                .ThenInclude(b => b.Author)
                .Where(bu => bu.User.UserName == User.Identity.Name && bu.Book.IsVisibleInCatalog)
                .AsNoTracking()
                .ToListAsync();

            List<CardItemViewModel> shoppingCard = new List<CardItemViewModel>();

            foreach (var item in userBooks)
            {
                shoppingCard.Add(_mapper.Map<CardItemViewModel>(item));
            }

            return Ok(shoppingCard);
        }

        [HttpPost("addItem")]
        public async Task<IActionResult> AddItem([FromBody] CardItemViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var book = await _context.Books
                .Include(b=>b.Author)
                .FirstOrDefaultAsync(b => b.Id == model.BookId);

            if(book is null)
            {
                return BadRequest($"Database does not contain book with given id!");
            }

            if(model.Amount > book.AmInStock)
            {
                return BadRequest($"There are only {book.AmInStock} copies available to buy");
            }

            if (!book.IsVisibleInCatalog)
            {
                return BadRequest("You can't add this book to shopping card");
            }

            var user = await _userManager.FindByNameAsync(User.Identity.Name);

            if (user is null)
                return StatusCode(500, "shok");

            var listUserBooks = await _context.BookUsers
                .Include(bu => bu.Book)
                .ThenInclude(b => b.Author)
                .Include(bu=>bu.User)
                .Where(bu => bu.UserId == user.Id)
                .ToListAsync();

            if (listUserBooks.Count >= 10)
            {
                return BadRequest("Shopping card can contain no more than 10 different books!");
            }

            var userBook = listUserBooks.FirstOrDefault(bu => bu.BookId == book.Id && bu.UserId == user.Id);

            if (userBook != null)
            {
                return BadRequest("You already have this item in your card!");
            }

            userBook = new BookUser
            {
                User = user,
                Book = book,
                Amount = model.Amount
            };

            _context.BookUsers.Add(userBook);

            await _context.SaveChangesAsync();

            return Ok(_mapper.Map<CardItemViewModel>(userBook));                
        }

        [HttpPut("updateCard")]
        public async Task<IActionResult> UpdateItem([FromBody] CardItemViewModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userBook = await _context.BookUsers
                .Include(bu=>bu.User)
                .Include(bu=>bu.Book)
                .ThenInclude(b=>b.Author)
                .FirstOrDefaultAsync(bu => bu.Id == model.Id.Value);

            if (!IsUserOwnerOfCard(userBook))
                return Forbid("You are not allowed to change cards of others");

            if(!userBook.Book.IsVisibleInCatalog)
            {
                return BadRequest("This book is no longer abailable");
            }

            if(model.Amount > userBook.Book.AmInStock)
            {
                return BadRequest($"There are only {userBook.Book.AmInStock} copies available");
            }

            userBook.Amount = model.Amount;

            await _context.SaveChangesAsync();

            model = _mapper.Map<CardItemViewModel>(userBook);

            return Ok(model);
        }

        [HttpDelete("deleteItem")]
        public async Task<IActionResult> DeleteItem(int Id)
        {
            var userBook = await _context.BookUsers
                .Include(bu=>bu.User)
                .FirstOrDefaultAsync(b => b.Id == Id);

            if (userBook == null)
                return BadRequest($"There is no card item with given id");

            if (!IsUserOwnerOfCard(userBook))
                return Forbid("You are not allowed to change this card item");

            

            _context.Remove(userBook);

            await _context.SaveChangesAsync();

            return Ok("Item was removed successfuly");
        }

        private bool IsUserOwnerOfCard(BookUser bu)
        {
            return bu.User.UserName == User.Identity.Name;
        }
    }
}