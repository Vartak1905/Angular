import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { APP_URL } from '../app-urls/app-urls';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  _save_commt_url = environment.baseUrl + APP_URL.BUSINESS_SAVE_COMMENT;

  constructor(public _httpClient: HttpClient) { }

  saveComment(_formData: any): Observable<any> {
    return this._httpClient.post<any>(this._save_commt_url,
      JSON.stringify(_formData)
    ).pipe(catchError(this.errorHandler));
  }


  errorHandler(error: HttpErrorResponse) {
    return throwError(error.message);
  }
}
