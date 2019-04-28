import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http' 

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component'
import { AccountModule } from './account/account.module';
import { HttpErrorInterceptor } from './interceptors/HttpErrorInterceptor';
import { ShowAuthDirective } from './directives/show-auth.directive';
import { CatalogModule } from './catalog/catalog.module';
import { HttpTokenAppenderInterceptor } from './interceptors/HttpTokenAppenderInterceptor';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ShowAuthDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AccountModule,
    HttpClientModule,
    CatalogModule,
    JwtModule.forRoot({
      config:{
        tokenGetter:function(){
          return localStorage.getItem("auth_token");
        },
        throwNoTokenError:false
      }
    })
  ],
  providers: [
    {
      provide:HTTP_INTERCEPTORS,
      useClass:HttpErrorInterceptor,
      multi:true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
