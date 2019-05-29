import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './card/card.component';
import { RouterModule } from '@angular/router';
import { routes } from './shopping-card.routing';
import { ShoppCardService } from '../services/shopCard.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [CardComponent],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  providers:[
    ShoppCardService
  ]
})
export class ShoppingCardModule { }
