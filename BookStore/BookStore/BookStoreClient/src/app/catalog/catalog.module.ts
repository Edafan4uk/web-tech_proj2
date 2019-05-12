import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BooksListComponent } from './books-list/books-list.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { routes } from './catalog.routing';
import { AuthGuardService } from '../guards/auth-guard.service';
import { CatalogService } from '../services/catalog.service';
import { AddToCartModalComponent } from './add-to-cart-modal/add-to-cart-modal.component';
import { EditBookModalComponent } from './edit-book-modal/edit-book-modal.component';
import { SortableDirective } from '../directives/sortable.directive';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: 
  [
    BooksListComponent, 
    AddToCartModalComponent, 
    EditBookModalComponent,
    SortableDirective
  ],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  providers:[
    AuthGuardService,
    CatalogService
  ],
  exports:
  [
    SortableDirective
  ],
  entryComponents:
  [
    AddToCartModalComponent,
    EditBookModalComponent
  ]
})
export class CatalogModule { }
