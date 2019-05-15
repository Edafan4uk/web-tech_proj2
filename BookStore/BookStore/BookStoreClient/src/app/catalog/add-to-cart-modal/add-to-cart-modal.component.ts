import { Component, OnInit, Input, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BookForAdmin } from '../Models/BookForAdmin';

@Component({
  selector: 'app-add-to-cart-modal',
  templateUrl: './add-to-cart-modal.component.html',
  styleUrls: ['./add-to-cart-modal.component.scss']
})
export class AddToCartModalComponent implements OnInit {

  private fb:FormBuilder;
  bookForm:FormGroup;

  constructor(
    private injector:Injector, 
    public activeModal: NgbActiveModal) {
    this.fb = this.injector.get(FormBuilder);
   }


  @Input() book:BookForAdmin;

  ngOnInit() {
    this.bookForm = this.createForm();
  }


  createForm():FormGroup{
    let form = this.fb.group({
      name:new FormControl('', [
        Validators.required,
        Validators.maxLength(50)
      ]),
      price:new FormControl(0,[
          Validators.required,
          this.priceValidator,          
          Validators.pattern("^[0-9]+$")
        ]
      ),
      amInStock:new FormControl(0,[
          this.amValidator,
          Validators.pattern("^[0-9]+$")
        ]
      ),
      authorName: new FormControl("",[
          Validators.required,
          Validators.maxLength(50)
        ]
      ),
      commentsActive: new FormControl(false, 
        [
          Validators.required
        ]),
      isVisible: new FormControl(true,[
        Validators.required
      ])
    });
    if(!this.book){
      return form;
    }
    else{
      console.log( this.book)
      form.setValue({
        name: this.book["name"],
        price: this.book['price'],
        amInStock: this.book['amInStock'],
        authorName: this.book['authorName'],
        commentsActive: this.book['commentsActive'],
        isVisible: this.book['isVisible']
      });
      return form;
    }    
  }

  amValidator(control:FormControl):{[s:string]:boolean}{
    if(control.value <= 0 || control.value > 10){
      return {"AmInStock":true}
    }
    return null;
  }

  private priceValidator(control:FormControl):{[s:string]:boolean}{
    if(control.value <= 0 || control.value > 2000){
      return {"Price":true}
    }
    return null;
  }

  submit(){
    let book: BookForAdmin = Object.assign({},this.bookForm.value) as BookForAdmin;

    this.activeModal.close(book);
  }

  private valid(pr:string):boolean{
    let contr = this.bookForm.controls[pr];
    return contr.valid&&contr.touched;
  }

  private invalid(pr:string):boolean{    
    let contr = this.bookForm.controls[pr];
    return contr.invalid&&contr.touched;
  }
}
