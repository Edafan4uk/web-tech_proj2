import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router'
import { UserService } from '../services/user.service';

@Injectable()
export class HasRoleGuardService implements CanActivate{
  
  constructor(public userService:UserService, public router:Router) { }

  canActivate(next:ActivatedRouteSnapshot):boolean{    
    let requiredRoles = next.data.roles as Array<string>;

    return this.userService.hasRoles(requiredRoles);
  }
}