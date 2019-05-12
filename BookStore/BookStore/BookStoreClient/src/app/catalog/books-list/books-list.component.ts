import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { CatalogService } from 'src/app/services/catalog.service';
import { Book } from '../Models/Book';
import { Observable } from 'rxjs';
import { SortableDirective, SortEvent } from 'src/app/directives/sortable.directive';

@Component({
  selector: 'app-books-list',
  templateUrl: './books-list.component.html',
  styleUrls: ['./books-list.component.scss']
})
export class BooksListComponent implements OnInit {

  books$: Observable<Book[]>;
  total$: Observable<number>;
  
  constructor(public service: CatalogService) {
    
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

}
