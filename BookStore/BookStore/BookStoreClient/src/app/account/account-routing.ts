import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CanUseSignGuardService } from '../guards/can-use-sign-guard.service';

export const routes:Routes = [
    {
        path:'account',
        canActivate:[CanUseSignGuardService],
        children:[
            {
                path:'login',
                component:LoginComponent
            },
            {
                path:'register',
                component: RegisterComponent
            }
        ]
    }
];