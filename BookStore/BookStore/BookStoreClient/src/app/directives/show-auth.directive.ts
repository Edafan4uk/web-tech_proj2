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
    this.userService.currentToken.subscribe((isAuthenticated:boolean)=>{
      if((!this.condition&&isAuthenticated||(this.condition&&!isAuthenticated)))
      {
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
      else{
        this.viewContainer.clear();
      }
    });
  }
}
