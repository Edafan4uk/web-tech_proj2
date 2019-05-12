import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routes } from './admin.routing';
import { UsersComponent } from './users/users.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserRolesModalComponent } from './user-roles-modal/user-roles-modal.component';
import { AdminUserService } from '../services/admin/admin-user.service';
import { HasRoleGuardService } from '../guards/has-role-guard.service';
import { CatalogModule } from '../catalog/catalog.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: 
  [
    UsersComponent, 
    UserRolesModalComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    CatalogModule,
    SharedModule
  ],
  providers:[AdminUserService, HasRoleGuardService],
  entryComponents:[UserRolesModalComponent]
})
export class AdminModule { }
