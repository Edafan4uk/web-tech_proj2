import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { LoginModel } from '../models/LoginModel';
import { ResponseModel } from '../models/ResponseModel';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as $ from 'jquery';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  resMod:ResponseModel;
  myForm:FormGroup;
  logModel:LoginModel;

  constructor(private userService:UserService, private router:Router) { }

  ngOnInit() {
    this.myForm = new FormGroup({
      "userName":new FormControl("",[
        Validators.required,
        Validators.email,
        Validators.maxLength(50)
      ]),
      "password":new FormControl("",[
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(30)
      ])
    });
    this.logModel = new LoginModel();
  }

  submit(){
    console.log(this.myForm.value);
    console.log(this.logModel)
    this.userService.login(this.logModel).subscribe((data:ResponseModel)=>{
      localStorage.setItem("auth_token",data.AuthToken);
      this.router.navigate(['/catalog'])
    },
    (error:any)=>{
      let temp = $('#myId');
      temp.addClass("alert-danger");
      temp.css("display","block");
      
      temp.html(error);
      setTimeout(()=>{
        temp.css("display","none");
        temp.removeClass("alert-danger");     
      },2000);
    });
  }

  private valid(pr:string):boolean{
    let contr = this.myForm.controls[pr];
    return contr.valid&&contr.touched;
  }

  private invalid(pr:string):boolean{    
    let contr = this.myForm.controls[pr];
    return contr.invalid&&contr.touched;
  }
}
