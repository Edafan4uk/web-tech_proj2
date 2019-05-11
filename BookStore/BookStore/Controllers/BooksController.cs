using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using AutoMapper;
using BookStore.Helpers.Models;
using BookStore.ViewModels;
using DAL.Data;
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
        private readonly IMapper _mapper;
        public BooksController(BookStoreContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet("getBooks")]
        public async Task<IActionResult> Get(ForTableModel model)
        {
            List<BookViewModel> list = new List<BookViewModel>();

            if(!(await _context.Books.AnyAsync()&&await _context.Authors.AnyAsync()))
            {
                return Ok(new List<BookViewModel>());
            }


            var books = await _context.Books
                .Include(b=>b.Author)
                .AsNoTracking()
                .ToListAsync();

            foreach (var item in books)
            {
                list.Add(_mapper.Map<BookViewModel>(item));
            }

            return Ok(list);
        }

        [HttpPost("addBook")]
        [Authorize(Roles = "Admin,Moderator")]
        public async Task<IActionResult> AddBook([FromBody] BookForAdminViewModel model)
        {   
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var check = await _context.Authors.AnyAsync();

            Author author = null;

            if (check)
            {
                var checkBook = await _context.Books
                    .FirstOrDefaultAsync(b => b.Name == model.Name && b.Author.Name == model.AuthorName);

                if (checkBook != null)
                    return BadRequest("There is already book with the same name and author");

                author = await _context.Authors
                    .FirstOrDefaultAsync(a => a.Name == model.AuthorName);
            }  
            
            if(author == null)
            {
                author = new Author
                {
                    Name = model.AuthorName
                };
                author = (_context.Authors.Add(author)).Entity;
            }

            var book = _mapper.Map<Book>(model);

            _context.Books.Add(book);

            await _context.SaveChangesAsync();

            book = await _context.Books.Include(b => b.Author).FirstAsync(b => b.Name == book.Name && b.Author.Name == model.AuthorName);

            return Ok(_mapper.Map<BookForAdminViewModel>(book));
        }    
        [HttpDelete("deleteBook/{id}")]
        [Authorize(Roles = "Admin,Moderator")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var book = await _context.Books
                .FirstOrDefaultAsync(b => b.Id == id);

            if(book!=null)
            {
                _context.Books.Remove(book);

                await _context.SaveChangesAsync();

                return Ok("Book was removed from database");
            }

            return BadRequest($"There is no book with id : {id} in database");
        }
        [HttpPut("updateBook/{id}")]
        [Authorize(Roles = "Admin,Moderator")]
        public async Task<IActionResult> UpdateBook(int id, [FromBody] BookForAdminViewModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var book = await _context.Books.Include(b=>b.Author)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (book == null)
                return BadRequest($"There is no book with id : {id} in database");

            var author = book.Author;

            book = _mapper.Map<Book>(model);

            if (model.AuthorName != author.Name)
            {
                author = await _context.Authors
                    .FirstOrDefaultAsync(a => a.Name == model.AuthorName);

                book.Author = author ?? _context.Authors.Add(new Author { Name = model.AuthorName }).Entity;
            }            

            await _context.SaveChangesAsync();

            return Ok(_mapper.Map<BookForAdminViewModel>(book));
        }
        private PropertyInfo GetPropertyInfo(string columnName)
        {
            columnName = columnName ?? "Id";
            var type = typeof(User);
            return type.GetProperty(columnName);
        }
    }
}