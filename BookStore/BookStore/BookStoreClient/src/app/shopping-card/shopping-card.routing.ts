import { Routes } from "@angular/router";
import { AuthGuardService } from '../guards/auth-guard.service';
import { CardComponent } from './card/card.component';

export const routes:Routes = [
    {
        path:'card',
        component:CardComponent,
        canActivate:[AuthGuardService]
    }
];