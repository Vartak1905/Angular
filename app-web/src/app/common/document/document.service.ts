import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { APP_URL } from '../app-urls/app-urls';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  _documentfetch_url = environment.baseUrl + APP_URL.BUSINESS_FETCH_DOCUMENT;
  _documentfetch_byname_url = environment.baseUrl + APP_URL.BUSINESS_FETCH_DOCUMENT_BY_PROPERTIES;
  _documentfetch_all_url = environment.baseUrl + APP_URL.BUSINESS_FETCH_ALL_DOCUMENT;

  constructor(public _httpClient: HttpClient) { }

  saveDocument(_url: string, post: Object): Observable<any> {
    return this._httpClient.post<any>(_url,
      post
    ).pipe(catchError(this.errorHandler));
  }

  fetchDocument(_formData: any): Observable<any> {
    return this._httpClient.get<any>(this._documentfetch_url, {
      responseType: 'json',
      params: {
        'paramsMap': JSON.stringify(_formData)
      }
    }).pipe(catchError(this.errorHandler));
  }

  fetchDocByName(_formData: any): Observable<any> {
    return this._httpClient.get<any>(this._documentfetch_byname_url, {
      responseType: 'json',
      params: {
        'paramsMap': JSON.stringify(_formData)
      }
    }).pipe(catchError(this.errorHandler));
  }

  fetchAllDocument(_formData: any): Observable<any> {
    return this._httpClient.get<any>(this._documentfetch_all_url, {
      responseType: 'json',
      params: {
        'paramsMap': JSON.stringify(_formData)
      }
    }).pipe(catchError(this.errorHandler));
  }

  deleteDocument(_url: string, _formData: any): Observable<any> {

    return this._httpClient.post<any>(_url, _formData,
      {
        responseType: 'json'
      }).pipe(catchError(this.errorHandler));
  }


  errorHandler(error: HttpErrorResponse) {
    return throwError(error.message);
  }
}
