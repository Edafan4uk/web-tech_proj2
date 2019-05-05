import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RouterModule } from '@angular/router';
import { routes } from './account-routing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CanUseSignGuardService } from '../guards/can-use-sign-guard.service';
import { ValidationService } from '../services/validation.service';


@NgModule({
  declarations: [LoginComponent, RegisterComponent],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    FormsModule
  ],
  exports:[
    LoginComponent,
    RegisterComponent
  ],
  providers:[
    CanUseSignGuardService
  ]
})
export class AccountModule { }
