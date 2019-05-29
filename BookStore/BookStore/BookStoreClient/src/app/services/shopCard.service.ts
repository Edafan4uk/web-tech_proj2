import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CardItem } from '../shopping-card/Models/CardItem';
import { Observable } from 'rxjs';

@Injectable()
export class ShoppCardService{

    private url:string = "api/shoppingcard";

    constructor(private http:HttpClient) {
    }

    addItem(item:CardItem): Observable<any>{
        return this.http.post(`${this.url}/addItem`, item);
    }

    card():Observable<CardItem[]>{
        return this.http.get<CardItem[]>(`${this.url}/myCard`);
    }

    updateItem(item:CardItem):Observable<CardItem>{
        return this.http.put<CardItem>(`${this.url}/updateCard`,item);
    }

    deleteItem(id:number):Observable<any>
    {
        return this.http.delete(`${this.url}/deleteItem/${id}`);
    }
}
