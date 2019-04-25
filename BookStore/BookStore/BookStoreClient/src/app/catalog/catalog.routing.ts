import { Routes } from "@angular/router";
import { BooksListComponent } from './books-list/books-list.component';
import { AuthGuardService } from '../guards/auth-guard.service';

export const routes:Routes = [
    {
        path:'catalog',
        component:BooksListComponent,
        canActivate:[AuthGuardService]
    }
];