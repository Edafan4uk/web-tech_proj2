import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { RegisterModel } from '../models/RegisterModel';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm:FormGroup;
  constructor(private userService:UserService, private router:Router) {
      
  }

  ngOnInit() {
    this.registerForm = this.createForm();
  }

  createForm():FormGroup{
    return new FormGroup({
      "FirstName":new FormControl("",[
        Validators.required,
        Validators.maxLength(30)
      ]),
      "LastName":new FormControl("",[
        Validators.required,
        Validators.maxLength(30)
      ]),
      "Email":new FormControl("",[
        Validators.required,
        Validators.email
      ]),
      "Password":new FormControl("",[
        Validators.required
      ]),
      "ConfirmPassword":new FormControl("",[
        Validators.required,
        this.confirmPasswordValidator
      ])
    })
  }

  confirmPasswordValidator(control:FormControl):{[s:string]:boolean}{
    if(!this)
      return null;
    if(control.value!==this.registerForm.controls["Password"]){
      return {"ConfirmPassword":true}
    }
    return null;
  }

  private valid(pr:string):boolean{
    let contr = this.registerForm.controls[pr];
    return contr.valid&&contr.touched;
  }

  private invalid(pr:string):boolean{    
    let contr = this.registerForm.controls[pr];
    return contr.invalid&&contr.touched;
  }

  submit(){
    let regModel:RegisterModel = Object.assign({},this.registerForm.value);
    this.userService.register(regModel).subscribe(()=>{
      this.router.navigate(['account/login']);
    });
  }

}
