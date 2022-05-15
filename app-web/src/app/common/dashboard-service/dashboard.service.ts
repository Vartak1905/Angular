import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private _httpClient: HttpClient
  ) { }

  getPendingRequest(_url: string): Observable<any> {
    return this._httpClient.get<any>(_url, {
      responseType: 'json'
    }).pipe(catchError(this.errorHandler));
  }

  getClientListing(_url: string): Observable<any> {
    return this._httpClient.get<any>(_url, {
      responseType: 'json'
    }).pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error.message);
  }
}
