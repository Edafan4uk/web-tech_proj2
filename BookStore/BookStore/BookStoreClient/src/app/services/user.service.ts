import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { ResponseModel } from '../account/models/ResponseModel';
import { LoginModel } from '../account/models/LoginModel';
import { RegisterModel } from '../account/models/RegisterModel';
import { JwtHelperService } from '@auth0/angular-jwt'
import { distinctUntilChanged, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class UserService{

  private currentTokenSubject:BehaviorSubject<boolean>; 
  private accountUrl:string = "/api/account";
  public currentToken:Observable<boolean>;  

  constructor(private http:HttpClient,private jwtHelper:JwtHelperService) {
    let cond = this.isAuthenticated();
    this.currentTokenSubject = new BehaviorSubject<boolean>(cond);
    this.currentToken = this.currentTokenSubject.asObservable().pipe(
      distinctUntilChanged()
    ); 
  }
  
  login(model:LoginModel):Observable<ResponseModel>{    
    return this.http.post<ResponseModel>(`${this.accountUrl}/login`,model);
  }

  register(model:RegisterModel):Observable<any>{
    return this.http.post(`${this.accountUrl}/register`,model);
  }

  logout(){
    localStorage.removeItem('auth_token');
  }

  facebookLogin(accessToken:string){
    let model = {};
    model["AccessToken"] = accessToken;
    return this.http.post<ResponseModel>(`${this.accountUrl}/facebookLogin`, model);
  }

  private isAuthenticated():boolean
  {
      try{
        let isExp = this.jwtHelper.isTokenExpired(localStorage.getItem('auth_token'));
        return !isExp;
      }
      catch(ex){
        return false;
      }
  }

  isAuthenticatedGuards():boolean{
    let cond = this.isAuthenticated();
    this.currentTokenSubject.next(cond);
    return cond;
  }
}
