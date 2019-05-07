import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor{

    constructor(public router:Router){}
    intercept(req:HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(req).pipe(
            catchError((err:HttpErrorResponse)=>{
                if(err.status === 401){
                    this.router.navigate(['account/login']);
                    throwError("Not authorized")
                }
                else{
                    let errorMessage = '';
                    if(err.status !== 500){                      
                        if(err.error instanceof ErrorEvent){
                            errorMessage = `Error: ${err.error.message}`;
                        }
                        else
                        {
                            if(err.error instanceof(Object)){
                                console.log(err.error)
                                for(let i in err.error){    
                                    console.log(err.error[i]);
                                    errorMessage = err.error[i].toString().split(',').join('; ');
                                }
                            }
                            else{
                                errorMessage = "Cannot reach server";
                            }                                        
                        }
                    }
                    else
                        errorMessage = "Internal server error";
                    
                    let temp = $('#myId');
                    temp.addClass("alert-danger");
                    temp.css("display","block");
      
                    temp.html(errorMessage);
                    setTimeout(()=>{
                      temp.css("display","none");
                      temp.removeClass("alert-danger");     
                    },2000);
                    return throwError(errorMessage);
                }
            })
        )
    }
}