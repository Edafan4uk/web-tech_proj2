import { Directive, TemplateRef, OnInit, ViewContainerRef, Input } from '@angular/core';
import { UserService } from '../services/user.service';

@Directive({
  selector: '[appShowAuth]'
})
export class ShowAuthDirective implements OnInit{
  
  private condition:boolean;

  @Input() set appShowAuth(condition:boolean){
    this.condition = condition;
  }

  constructor(private templateRef:TemplateRef<any>,
              private userService:UserService,
              private viewContainer:ViewContainerRef) { }

  ngOnInit(): void {
    if((!this.condition&&this.userService.isAuthenticated())||(this.condition&&!this.userService.isAuthenticated())){
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
    else{
      this.viewContainer.clear();
    }
  }
}
