import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BooksListComponent } from './books-list/books-list.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { routes } from './catalog.routing';
import { AuthGuardService } from '../guards/auth-guard.service';
import { CatalogService } from '../services/catalog.service';

@NgModule({
  declarations: [BooksListComponent],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
    FormsModule
  ],
  exports:[
    BooksListComponent
  ],
  providers:[
    AuthGuardService,
    CatalogService
  ]
})
export class CatalogModule { }
