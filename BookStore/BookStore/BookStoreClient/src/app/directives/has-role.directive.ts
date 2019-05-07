import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective implements OnInit{

  private requiredRoles:string[];
  
  @Input() set appHasRole(req:string[]){
    this.requiredRoles = req
  }

  constructor(private templateRef:TemplateRef<any>,
              private userService:UserService,
              private viewContainer:ViewContainerRef) { }


  ngOnInit():void{
    if(!this.requiredRoles){
      this.viewContainer.clear();
      return;
    }
    this.userService.currentToken.subscribe((isAuthenticated:boolean)=>{
      if(isAuthenticated&&this.userService.hasRoles(this.requiredRoles)){
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
      else{
        this.viewContainer.clear();
      }
    })
  }
}
