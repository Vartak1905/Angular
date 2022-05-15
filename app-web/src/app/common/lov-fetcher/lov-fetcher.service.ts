import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { APP_URL } from '../app-urls/app-urls';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LovFetcherService {


  constructor(
    private _httpClient: HttpClient
  ) { }

  getLovList(_url: string): Observable<any> {
    return this._httpClient.get<any>(_url, {
      responseType: 'json'
    }).pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error.message);
  }

}
