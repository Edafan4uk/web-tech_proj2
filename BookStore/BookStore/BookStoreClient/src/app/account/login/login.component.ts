import { Component, OnInit, NgZone } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { LoginModel } from '../models/LoginModel';
import { ResponseModel } from '../models/ResponseModel';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as $ from 'jquery';
import { Router } from '@angular/router';
declare var FB:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  resMod:ResponseModel;
  myForm:FormGroup;
  logModel:LoginModel;

  constructor(private userService:UserService, private router:Router,private zone:NgZone) { }

  ngOnInit() { 
    this.myForm =  this.createForm();   
    this.logModel = new LoginModel();
    
    (window as any).fbAsyncInit = function() {
      FB.init({
        appId      : '430252394405135',
        cookie     : true,
        xfbml      : true,
        version    : 'v3.3'
      });
        
      FB.AppEvents.logPageView();   
        
    };
  
    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "https://connect.facebook.net/en_US/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));

  }

  isOnline():boolean{
    return navigator.onLine;
  }
  
  loginFacebook(){
    FB.getLoginStatus((response)=>
    {
      if(response.status === "connected"){
        this.zone.run(()=>{
          this.userService.facebookLogin(response.authResponse.accessToken).subscribe((re:ResponseModel)=>{
            localStorage.setItem("auth_token",re.AuthToken);
            this.router.navigate(['catalog']);
          });
        });
      }
      else{
        FB.login(r=>{
          if(r.status === "connected"){
            this.zone.run(()=>{
              this.userService.facebookLogin(r.authResponse.accessToken).subscribe((re:ResponseModel)=>{
                localStorage.setItem("auth_token",re.AuthToken);
                this.router.navigate(['catalog']);
              });
            });
          }
        },
        {
          scope:"email"
        });
      }
    })
  }

  createForm():FormGroup{
    return new FormGroup({
        "UserName":new FormControl("",[
          Validators.required,
          Validators.email,
          Validators.maxLength(50)
        ]),
        "Password":new FormControl("",[
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(30)
        ])});
  }

  submit(){
    this.logModel = Object.assign({},this.myForm.value) as LoginModel;
    console.log(this.logModel);
    this.userService.login(this.logModel).subscribe((data:ResponseModel)=>{
      localStorage.setItem("auth_token",data.AuthToken);
      this.router.navigate(['/catalog'])
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
