import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from '../auth-service/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { AppLayoutService } from 'src/app/app-layout/app-layout.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private injector: Injector, private _cookieService: CookieService, private _snackbar: MatSnackBar, private _layoutService: AppLayoutService, private _router: Router, private _ngxSpinnerService: NgxSpinnerService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {

    let _authService = this.injector.get(AuthService);

    let tokenizedReq = req.clone({
      setHeaders: { Authorization: `Bearer ${_authService.getToken()}` }
    });

    return next.handle(tokenizedReq).pipe(

      catchError((error: HttpErrorResponse) => {
        if (error.status == 401 || error.status == 500) {
          this._cookieService.delete("access-token");
          this._layoutService.menu = '';
          this._layoutService.emitLoggedUser(null);
          this._snackbar.open("Something went wrong. Please relogin", "Dismiss", {
            duration: 2000,
          });
          this._ngxSpinnerService.hide();
          if (this._router.url != '/login') 
            this._router.navigate(['login']);
        }
        // let data = {};
        // data = {
        //   response: 'Token is not valid.',
        //   status: 200
        // };
        // let logouturl = environment.logoutUrl + APP_URL.UMGMT_USER_LOGOUT;
        // window.location.href = logouturl;

        return throwError(error);

      }));
  }

}
