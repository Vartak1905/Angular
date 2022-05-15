import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { APP_URL } from '../app-urls/app-urls';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(public _httpClient: HttpClient) { }

  private _attachment_save_url: string = environment.baseUrl + APP_URL.BUSINESS_ATTACHMENT_SAVE_ATT;
  private _attachment_get_url: string = environment.baseUrl + APP_URL.BUSINESS_ATTACHMENT_GET_ATT;
  private _process_request_url: string = environment.baseUrl + APP_URL.WORKFLOW_PROCESS_REQUEST;

  submitCompanyData(_url: string, params = {}): Observable<any> {
    params['responseType'] = 'json';
    return this._httpClient.post<any>(_url, params).pipe(catchError(this.errorHandler));
  }

  saveAttachment(post: Object): Observable<any> {
    return this._httpClient.post<any>(this._attachment_save_url,
      post,
      {
        responseType: 'json'
      }
    ).pipe(catchError(this.errorHandler));
  }

  processRequest(post: Object): Observable<any> {
    return this._httpClient.post<any>(this._process_request_url,
      post,
      {
        responseType: 'json'
      }
    ).pipe(catchError(this.errorHandler));
  }

  getAttachment(post: Object): Observable<any> {
    var queryParams = [];
    for (var p in post)
      if (post.hasOwnProperty(p)) {
        queryParams.push(encodeURIComponent(p) + "=" + encodeURIComponent(post[p]));
      }

    return this._httpClient.get<any>(this._attachment_get_url + "?" + queryParams.join("&")).pipe(catchError(this.errorHandler));
  }

  fetchClient(_url: string, paramsMap?: string): Observable<any> {
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
