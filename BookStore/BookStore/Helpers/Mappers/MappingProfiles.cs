using AutoMapper;
using BookStore.ViewModels;
using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookStore.Helpers.Mappers
{
    public class MappingProfiles:Profile
    {
        public MappingProfiles()
        {
            CreateMap<User, UserViewModel>()
                .ReverseMap();

            CreateMap<Book, BookForAdminViewModel>()
                .ForMember(dest=>dest.AuthorName, o=>o.MapFrom(b=>b.Author.Name))
                .ForMember(dest=>dest.IsVisible, o=>o.MapFrom(b=>b.IsVisibleInCatalog))
                .ReverseMap();

            CreateMap<Book, BookViewModel>()
                .ForMember(dest => dest.AuthorName, o => o.MapFrom(b => b.Author.Name))
                .ReverseMap();

            CreateMap<BookUser, CardItemViewModel>()
                .ForMember(dest => dest.BookName, o => o.MapFrom(b => b.Book.Name))
                .ForMember(dest => dest.AuthorName, o => o.MapFrom(b => b.Book.Author.Name))
                .ForMember(dest => dest.BookId, o => o.MapFrom(b => b.Id));
        }
    }
}
