import { Injectable, Inject } from '@angular/core';
import { AbstractService } from '../Generics/abstract.service';
import { UserForA } from 'src/app/admin/Models/UserForA';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AdminUserService extends AbstractService<UserForA> {

  constructor(http:HttpClient) {
    super(http);
    this.apiEntityUrl = "api/user";
    this.methodName = "usersWithRoles";
  }

  addUser(user:UserForA):Observable<UserForA>{
    return this.http.post<UserForA>(`${this.apiEntityUrl}/addToRoles`,user);
  }

}
