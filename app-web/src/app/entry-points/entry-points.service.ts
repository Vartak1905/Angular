import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { APP_URL } from '../common/app-urls/app-urls';

@Injectable({
  providedIn: 'root'
})
export class EntryPointsService {

  constructor(
    private _httpClient: HttpClient
  ) { }

  private _umgmt_login_url: string = environment.baseUrl + APP_URL.UMGMT_USER_LOGIN;
  private _umgmt_reset_password_url: string = environment.baseUrl + APP_URL.UMGMT_RESET_PASSWORD;

  login(formData: Object): Observable<any> {
    return this._httpClient.post<any>(this._umgmt_login_url, formData, {
      responseType: 'json'
    }).pipe(catchError(this.errorHandler));
  }

  logout(_url: string, _dataObj: Object): Observable<any> {
    return this._httpClient.post<any>(_url, _dataObj , {
      responseType: 'json'
    }).pipe(catchError(this.errorHandler));
  }

  
  resetPassword(formData: Object): Observable<any> {
    return this._httpClient.post<any>(this._umgmt_reset_password_url, formData, {
      responseType: 'json'
    }).pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error.message);
  }
}
