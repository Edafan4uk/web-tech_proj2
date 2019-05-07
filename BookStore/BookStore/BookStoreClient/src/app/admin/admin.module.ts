import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routes } from './admin.routing';
import { UsersComponent } from './users/users.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SortableDirective } from '../directives/sortable.directive';
import { UserRolesModalComponent } from './user-roles-modal/user-roles-modal.component';
import { AdminUserService } from '../services/admin/admin-user.service';
import { HasRoleGuardService } from '../guards/has-role-guard.service';

@NgModule({
  declarations: [UsersComponent, SortableDirective, UserRolesModalComponent],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
    NgbModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers:[AdminUserService, HasRoleGuardService],
  entryComponents:[UserRolesModalComponent]
})
export class AdminModule { }
