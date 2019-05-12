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

  ngOnInit() {
    this.bookForm = this.createForm();
  }


  createForm():FormGroup{
    return this.fb.group({
      "name":new FormControl("", [
        Validators.required,
        Validators.maxLength(50)
      ]),
      "price":new FormControl(0,[
          Validators.required,
          this.priceValidator
        ]
      ),
      "amInStock":new FormControl(0,[
          this.amValidator
        ]
      ),
      "authorName": new FormControl("",[
          Validators.required,
          Validators.maxLength(50)
        ]
      ),
      "commentsActive": new FormControl({
        value:false,
        validators:[
          Validators.required
        ]
      }),
      "isVisible": new FormControl({
        value:true,
        validators:[
          Validators.required
        ]
      })
    });    
  }

  amValidator(control:FormControl):{[s:string]:boolean}{
    if(control.value <= 0 || control.value > 100){
      return {"amInStock":true}
    }
    return null;
  }

  private priceValidator(control:FormControl):{[s:string]:boolean}{
    if(control.value <= 0 || control.value > 2000){
      return {"price":true}
    }
    return null;
  }

  submit(){
    let book: BookForAdmin =  Object.assign({},this.bookForm.value);

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
