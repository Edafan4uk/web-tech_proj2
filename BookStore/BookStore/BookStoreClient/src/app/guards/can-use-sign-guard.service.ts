import { Injectable } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class CanUseSignGuardService  implements CanActivate{

  constructor(public userService:UserService, public router:Router) { }

  canActivate():boolean{
    if(this.userService.isAuthenticatedGuards()){
      this.router.navigate(['']);
      return false;
    }
    return true;
  }
}
