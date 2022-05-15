import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { APP_URL } from '../app-urls/app-urls';
import { User } from '../auth-models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: User;

  constructor(
    private _cookieService: CookieService,
    private _http: HttpClient
    ) {}

  /* !! -> works as a boolean
      If token is available then returns true else false
  */
  loggedIn() {
    return !!localStorage.getItem('token');
  }

  public getUser() {
    return this.user;
  }

  getToken() {
    return this._cookieService.get('access-token');
  }

  public logoutUser(): Observable<any> {
    let _url = environment.baseUrl + APP_URL.UMGMT_USER_LOGOUT;
    return this._http.post(_url, {}).pipe();
  }
}
