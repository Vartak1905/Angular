import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ServiceResponse } from '../common/service-response';
import { environment } from 'src/environments/environment';
import { APP_URL } from '../common/app-urls/app-urls';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AppLayoutService {

  constructor(
    private _httpClient: HttpClient,
    private _router: Router
  ) { }

  user: Object;
  menu: Object;
  homepage: string = '';

  private _loggedUser: BehaviorSubject<any> = new BehaviorSubject(null);
  public _loggedUser$ = this._loggedUser.asObservable();


  _menu_url = environment.baseUrl + APP_URL.UMGMT_GET_MENU_DETAILS;

  emitLoggedUser(data: Object) {
    this._loggedUser.next(data);
  }

  private _menuDetails: BehaviorSubject<any> = new BehaviorSubject(null);
  public _menuDetails$ = this._menuDetails.asObservable();

  emitMenuDetails(data: Object) {
    this._menuDetails.next(data);
  }

  getUserDetails(_url: string): Observable<any> {
    return this._httpClient.get<any>(_url, {
      responseType: 'json'
    }).pipe(catchError(this.errorHandler));
  }

  getMenuDetails(_url: string): Observable<any> {
    return this._httpClient.get<any>(_url, {
      responseType: 'json'
    }).pipe(catchError(this.errorHandler));
  }

  updateMenu(isNavigate) {

    this.emitMenuDetails([]);
    this.getMenuDetails(this._menu_url).subscribe(res => {

      if (res.status === ServiceResponse.STATUS_SUCCESS) {

        this.menu = res.response.data;
        if(this.menu instanceof Array){
          this.menu= this.menu.sort((e1, e2) => e1.position > e2.position ? 1 : -1);
        }
        if (this.menu && this.menu[0]) {
          if (this.menu[0]["childrenList"][0]) {
            this.homepage = this.menu[0]["childrenList"][0].route;
            this.menu[0]["childrenList"] = this.menu[0]["childrenList"].sort((e1, e2) => e1.position > e2.position ? 1 : -1);

            if (isNavigate == true) {
              this._router.navigate([this.menu[0]["childrenList"][0].route]);
            }
          } else {
            this.homepage = this.menu[0].route;
            if (isNavigate == true) {
              this._router.navigate([this.menu[0].route]);
            }
          }
        }
        let menu: any = this.menu;
        menu = menu.sort((item1, item2) => {
          return item1.position - item2.position;
        });
        this.emitMenuDetails(menu);
      }
    });
  }
  errorHandler(error: HttpErrorResponse) {
    return throwError(error.message);
  }

}
