import { Injectable, Injector, ErrorHandler } from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler{
    constructor(private injector:Injector){}

    handleError(error:Error|HttpErrorResponse){
        console.log(error.message);
    }
}