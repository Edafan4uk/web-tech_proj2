import { Component, OnInit, ViewChild, ViewChildren, QueryList, Injector } from '@angular/core';
import { CatalogService } from 'src/app/services/catalog.service';
import { Book } from '../Models/Book';
import { Observable } from 'rxjs';
import { SortableDirective, SortEvent } from 'src/app/directives/sortable.directive';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddToCartModalComponent } from '../add-to-cart-modal/add-to-cart-modal.component';
import { BookForAdmin } from '../Models/BookForAdmin';

@Component({
  selector: 'app-books-list',
  templateUrl: './books-list.component.html',
  styleUrls: ['./books-list.component.scss']
})
export class BooksListComponent implements OnInit {

  books$: Observable<Book[]>;
  total$: Observable<number>;
  
  constructor(public service: CatalogService,
    private modal: NgbModal,
    private injector: Injector) {
    
  }

  @ViewChildren(SortableDirective) headers: QueryList<SortableDirective>;

  ngOnInit() {
    this.books$ = this.service.entities$;
    this.total$ = this.service.total$;    
  }

  onSort({column, direction}:SortEvent){
    this.headers.forEach(item=>{
      if(item.sortable !== column){
        item.direction = '';
      }
    });
    console.log(direction)
    this.service.sortColumn = column;
    this.service.sortDirection = direction
  }
  openModal(){
    let modal = this.modal.open(AddToCartModalComponent, {
      centered:true,
      injector:this.injector,
      beforeDismiss:()=>{
        return confirm("There are unsaved changes.Are you sure you want to close the window?");
      }
    });
    modal.result.then((result:BookForAdmin)=>{
      console.log(result)
      let add = this.service.addBook(result);
      add.subscribe((b:BookForAdmin)=>{
        this.service.page = 1;
      })},
    (reason:any)=>{});
  
  }

}
