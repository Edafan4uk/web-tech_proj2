using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BookStore.ViewModels;
using DAL.Data;
using DAL.DTO_s;
using DAL.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class BooksController : Controller
    {
        private readonly BookStoreContext _context;
        public BooksController(BookStoreContext context)
        {
            _context = context;
        }
        [HttpGet]
        public IActionResult Get()
        {
            return Ok();
        }
        [HttpPost("addBook")]
        [Authorize(Roles = "Admin,Moderator")]
        public async Task<IActionResult> AddBook([FromBody] BookViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            var check = await _context.Books.Where(b => b.Name == model.Name && b.Author.Name == model.AuthorName).SingleAsync();

            if (check != null)
            {
                return BadRequest($"There is already book named {model.Name} written by {model.AuthorName}");
            }

            var author = await _context.Authors.Where(a => a.Name == model.AuthorName).SingleAsync();

            if (author == null)
            {
                author = new Author
                {
                    Name = model.AuthorName                    
                };
                author = (await _context.Authors.AddAsync(author)).Entity;
            }

            var book = new Book
            {
                Name = model.Name,
                Price = model.Price,
                AmInStock = model.AmInStock ?? 0,
                CommentsActive = model.CommentsActive,
                IsVisibleInCatalog = model.IsVisible,
                Author = author
            };

            book = (await _context.Books.AddAsync(book)).Entity;

            await _context.SaveChangesAsync();

            return Ok(book);
        }
    }
}