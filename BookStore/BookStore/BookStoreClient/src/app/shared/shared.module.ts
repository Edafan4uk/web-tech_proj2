import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortableDirective } from '../directives/sortable.directive';
import { HasRoleDirective } from '../directives/has-role.directive';

@NgModule({
  declarations: [SortableDirective,HasRoleDirective],
  imports: [
    CommonModule
  ],
  exports:
  [
    SortableDirective
    ,HasRoleDirective
  ]
})
export class SharedModule { }
