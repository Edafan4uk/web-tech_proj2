import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http' 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component'
import { AccountModule } from './account/account.module';
import { HttpErrorInterceptor } from './interceptors/HttpErrorInterceptor';
import { ShowAuthDirective } from './directives/show-auth.directive';
import { CatalogModule } from './catalog/catalog.module';
import { JwtModule } from '@auth0/angular-jwt';
import { AdminModule } from './admin/admin.module';
import { HasRoleDirective } from './directives/has-role.directive';
import { SharedModule } from './shared/shared.module';
import { ShoppingCardModule } from './shopping-card/shopping-card.module';

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
    SharedModule,
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
    }),
    AdminModule,
    ShoppingCardModule    
  ],
  providers: [
    {
      provide:HTTP_INTERCEPTORS,
      useClass:HttpErrorInterceptor,
      multi:true
    }
  ],
  exports:[],
  bootstrap: [AppComponent]
})
export class AppModule { }
