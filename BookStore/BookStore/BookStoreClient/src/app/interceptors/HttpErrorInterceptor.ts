import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export class HttpErrorInterceptor implements HttpInterceptor{
    intercept(req:HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(req).pipe(
            catchError((err:HttpErrorResponse)=>{
                let errorMessage = '';
                
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
                return throwError(errorMessage);
            })
        )
    }
}