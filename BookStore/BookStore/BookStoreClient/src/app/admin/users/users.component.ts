import { Component, OnInit, ViewChildren, QueryList, Injector } from '@angular/core';
import { AdminUserService } from 'src/app/services/admin/admin-user.service';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { UserForA } from '../Models/UserForA';
import { SortableDirective, SortEvent } from 'src/app/directives/sortable.directive';
import { tap } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserRolesModalComponent } from '../user-roles-modal/user-roles-modal.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users$: Observable<UserForA[]>;
  total$: Observable<number>;

  @ViewChildren(SortableDirective) headers:QueryList<SortableDirective>

  constructor(private service:AdminUserService, private modalSe:NgbModal, private injector:Injector) {
    this.users$ = service.entities$;
    this.total$ = service.total$;
    this.users$.pipe(
      tap(()=>{console.log("res");})
    )
   }

  ngOnInit() {
  }

  onSort({column, direction}:SortEvent){
    this.headers.forEach(item=>{
      if(item.sortable !== column){
        item.direction = '';
      }
    });
    console.log(direction)
    this.service.sortColumn = column;
    this.service.sortDirection = direction
  }
  openModal(user:UserForA){
    let modal = this.modalSe.open(UserRolesModalComponent, {
      centered:true,
      injector:this.injector,
      beforeDismiss:()=>{
        return confirm("There are unsaved changes.Are you sure you want to close the window?");
      }
    });
    modal.componentInstance.user = user;
    modal.result.then((result:UserForA)=>{
      console.log("works")
      let add = this.service.addUser(result);
      if(add)
        add.subscribe((u)=>{
          user.roles = u.roles;
        })},
        (reason:any)=>{});
    
  }
}
