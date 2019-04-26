import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ResponseModel } from '../account/models/ResponseModel';
import { LoginModel } from '../account/models/LoginModel';
import { RegisterModel } from '../account/models/RegisterModel';
import { JwtHelperService } from '@auth0/angular-jwt'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private accountUrl:string = "/api/account";
  constructor(public http:HttpClient,public jwtHelper:JwtHelperService) { }

  login(model:LoginModel):Observable<ResponseModel>{    
    return this.http.post<ResponseModel>(`${this.accountUrl}/login`,model);
  }

  register(model:RegisterModel):Observable<any>{
    return this.http.post(`${this.accountUrl}/register`,model);
  }

  isAuthenticated():boolean{
    return this.jwtHelper.isTokenExpired(localStorage.getItem('auth_token'));
  }
}
