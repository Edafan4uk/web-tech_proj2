import { Component, OnInit } from '@angular/core';
import { CatalogService } from 'src/app/services/catalog.service';

@Component({
  selector: 'app-books-list',
  templateUrl: './books-list.component.html',
  styleUrls: ['./books-list.component.scss']
})
export class BooksListComponent implements OnInit {

  constructor(public catService:CatalogService) { }

  ngOnInit() {
  }

  getBooks(){
    this.catService.getCatalog().subscribe(
      ()=>{
        alert('hi')
      },
      (error:any)=>{
      alert('bye');
    })
  }

}
