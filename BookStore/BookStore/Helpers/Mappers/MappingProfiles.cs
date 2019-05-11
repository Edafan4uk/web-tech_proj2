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
                .ReverseMap();

            CreateMap<Book, BookViewModel>()
                .ForMember(dest => dest.AuthorName, o => o.MapFrom(b => b.Author.Name))
                .ReverseMap();
        }
    }
}
