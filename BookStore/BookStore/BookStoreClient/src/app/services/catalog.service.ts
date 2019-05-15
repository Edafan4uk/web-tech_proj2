import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AbstractService } from './Generics/abstract.service';
import { Book } from '../catalog/Models/Book';
import { BookForAdmin } from '../catalog/Models/BookForAdmin';

@Injectable()
export class CatalogService extends AbstractService<Book>{


  constructor(http:HttpClient) {
    super(http);
    this.apiEntityUrl = "api/books";
    this.methodName = "getBooks";
   }

   addBook(book:BookForAdmin):Observable<BookForAdmin>{
     console.log(book)
     return this.http.post<BookForAdmin>(`${this.apiEntityUrl}/addBook`,book);
   }

   getById(id: number):Observable<BookForAdmin>{
     return this.http.get<BookForAdmin>(`${this.apiEntityUrl}/?id=${id}`);
   }

   deleteBook(id:number):Observable<any>{
     return this.http.delete(`${this.apiEntityUrl}/deleteBook/${id}`);
   }

   updateBook(book:BookForAdmin):Observable<BookForAdmin>{
     return this.http.put<BookForAdmin>(`${this.apiEntityUrl}/updateBook/${book.Id}`,book);
   }

}
