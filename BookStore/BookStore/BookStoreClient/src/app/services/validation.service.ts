import { Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Injectable()
export class ValidationService {

  constructor() { }

  valid(form:FormGroup, controlName:string):boolean{
    if(!form)
      return true;
    let contr = form.controls[controlName];
    return contr.valid&&contr.touched;
  }

  invalid(form:FormGroup, controlName:string):boolean{
    if(!form)
      return true;
    let contr = form.controls[controlName];
    return contr.invalid&&contr.touched;
  }
}
