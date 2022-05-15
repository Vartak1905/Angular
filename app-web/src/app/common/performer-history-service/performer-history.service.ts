import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PerformerHistoryService {

  constructor(public _httpClient: HttpClient) { }

  fetchPerformerHistory(_url: string, paramsMap: string): Observable<any> {
    return this._httpClient.get<any>(_url, {
      params: {
        'paramsMap': paramsMap
      },
      responseType: 'json'
    }).pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error.message);
  }
}
