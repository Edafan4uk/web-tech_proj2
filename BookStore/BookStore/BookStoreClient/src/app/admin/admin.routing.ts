import { Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { HasRoleGuardService } from '../guards/has-role-guard.service';


export const routes: Routes = [
    {
        path:'admin',
        canActivate:[HasRoleGuardService],
        children:[
            {
                path:'users',
                component:UsersComponent
            }
        ],
        data:{roles:['Admin']}
    }
]