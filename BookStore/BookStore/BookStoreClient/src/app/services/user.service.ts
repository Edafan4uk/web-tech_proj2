import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ResponseModel } from '../account/models/ResponseModel';
import { LoginModel } from '../account/models/LoginModel';
import { RegisterModel } from '../account/models/RegisterModel';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private accountUrl:string = "/api/account";
  constructor(public http:HttpClient) { }

  login(model:LoginModel):Observable<ResponseModel>{    
    return this.http.post<ResponseModel>(`${this.accountUrl}/login`,model);
  }

  register(model:RegisterModel):Observable<any>{
    return this.http.post(`${this.accountUrl}/register`,model);
  }

  isAuthenticated():boolean{
    return !!localStorage.getItem("auth_token");
  }
}
