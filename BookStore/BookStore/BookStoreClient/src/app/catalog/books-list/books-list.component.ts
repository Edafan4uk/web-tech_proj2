import { Component, OnInit, ViewChild, ViewChildren, QueryList, Injector, OnDestroy } from '@angular/core';
import { CatalogService } from 'src/app/services/catalog.service';
import { Book } from '../Models/Book';
import { Observable } from 'rxjs';
import { SortableDirective, SortEvent } from 'src/app/directives/sortable.directive';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddToCartModalComponent } from '../add-to-cart-modal/add-to-cart-modal.component';
import { BookForAdmin } from '../Models/BookForAdmin';
import { UserService } from 'src/app/services/user.service';
import { destroyView } from '@angular/core/src/view/view';

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
    private injector: Injector,
    private userService: UserService) {
    
    this.userService.currentToken.subscribe(()=>{
      //this.service.page = 1;
    })
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
  openModal(book: BookForAdmin){
    let modal = this.modal.open(AddToCartModalComponent, {
      centered:true,
      injector:this.injector,
      beforeDismiss:()=>{
        return confirm("There are unsaved changes.Are you sure you want to close the window?");
      }
    });
    if(book){
      console.log(book)
      modal.componentInstance.book = Object.assign({},book);
      modal.result.then((result:BookForAdmin)=>{
        console.log(result)
        let add = this.service.updateBook(result);
        add.subscribe((b:BookForAdmin)=>{
          this.service.page = 1;
        })},
      (reason:any)=>{});
    }
    else{
      modal.result.then((result:BookForAdmin)=>{
        console.log(result)
        let add = this.service.addBook(result);
        add.subscribe((b:BookForAdmin)=>{
          this.service.page = 1;
        })},
      (reason:any)=>{});
    }
  
  }

  delete(book){
    console.log(book.id);
    this.service.deleteBook(book.id).subscribe(()=>{
      this.service.page = 1;
    })
  }

}
