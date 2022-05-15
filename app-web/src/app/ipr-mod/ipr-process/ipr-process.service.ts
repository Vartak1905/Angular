import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IprProcessService {

  static QUICK_IPR = "quickIPR";
  static CREATE_IPR = "createIPR";

  constructor(public _httpClient: HttpClient) { }

  fecthIPRProcess(_url: string, paramsMap: string): Observable<any> {
    return this._httpClient.get<any>(_url, {
      params: {
        'paramsMap': paramsMap
      },
      responseType: 'json'
    }).pipe(catchError(this.errorHandler));
  }

  fethAllStages(_url: string, paramsMap: string): Observable<any> {
    return this._httpClient.get<any>(_url, {
      params: {
        'paramsMap': paramsMap
      },
      responseType: 'json'
    }).pipe(catchError(this.errorHandler));
  }

  saveIPRProcess(_url: string, params: any): Observable<any> {
    return this._httpClient.post<any>(_url, params).pipe(catchError(this.errorHandler));
  }

  saveInvitations(_url: string, params: any): Observable<any> {
    return this._httpClient.post<any>(_url, params).pipe(catchError(this.errorHandler));
  }

  fecthAllInvitations(_url: string, paramsMap: any): Observable<any> {
    return this._httpClient.get<any>(_url, {
      params: {
        "paramsMap": JSON.stringify(paramsMap)
      },
      responseType: 'json'
    }).pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error.message);
  }
}
