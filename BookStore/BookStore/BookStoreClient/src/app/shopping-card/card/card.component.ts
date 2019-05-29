import { Component, OnInit } from '@angular/core';
import { CardItem } from '../Models/CardItem';
import { ShoppCardService } from 'src/app/services/shopCard.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  collection: CardItem[];

  constructor(private service: ShoppCardService) { }

  ngOnInit() {
    this.card();
    console.log("sd")
  }

  card(){
    this.service.card().subscribe((col:CardItem[])=>{
      this.collection = col;
    })
  }

}
