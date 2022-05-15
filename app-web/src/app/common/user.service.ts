import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { APP_URL } from './app-urls/app-urls';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  _attachment_save_url = environment.baseUrl + APP_URL.USER_ATTCHMENT_SAVE;
  _attachment_get_url = environment.baseUrl + APP_URL.USER_ATTCHMENT_GET;
  _userlisting_get_url = environment.baseUrl + APP_URL.USERS_LISTING_BY_ROLE;
  _userFilterListing_get_url = environment.baseUrl + APP_URL.USERS_LISTING_FILTER;
  _policylisting_group_get_url = environment.baseUrl + APP_URL.BUSINESS_FETCH_CURRENT_GROUP_POLICIES;
  _policylisting_self_get_url = environment.baseUrl + APP_URL.BUSINESS_FETCH_CURRENT_SELF_POLICIES;
  _user_update_status_url = environment.baseUrl + APP_URL.UMGMT_UPDATE_STATUS;
  _reset_password_mail_url = environment.baseUrl + APP_URL.UMGMT_RESET_PASSWORD_MAIL;
  _send_activation_mail_url = environment.baseUrl + APP_URL.UMGMT_SEND_ACTIVATION_MAIL;

  constructor(public _httpClient: HttpClient) { }

  saveAttachment(post: Object): Observable<any> {
    return this._httpClient.post<any>(this._attachment_save_url,
      post,
      {
        responseType: 'json'
      }
    ).pipe(catchError(this.errorHandler));
  }

  submitUserData(_url: string, params = {}): Observable<any> {
    return this._httpClient.post<any>(_url, params).pipe(catchError(this.errorHandler));
  }
  fecthUser(_url: string, paramsMap: string): Observable<any> {
    return this._httpClient.get<any>(_url, {
      params: {
        'paramsMap': paramsMap
      },
      responseType: 'json'
    }).pipe(catchError(this.errorHandler));
  }

  getAttachment(post: Object): Observable<any> {
    var queryParams = [];
    for (var p in post)
      if (post.hasOwnProperty(p)) {
        queryParams.push(encodeURIComponent(p) + "=" + encodeURIComponent(post[p]));
      }

    return this._httpClient.get<any>(this._attachment_get_url + "?" + queryParams.join("&")).pipe(catchError(this.errorHandler));
  }

  getUserListing(post: Object) {
    var queryParams = [];
    for (var p in post)
      if (post.hasOwnProperty(p)) {
        queryParams.push(encodeURIComponent(p) + "=" + encodeURIComponent(post[p]));
      }

    return this._httpClient.get<any>(this._userlisting_get_url + "?" + queryParams.join("&")).pipe(catchError(this.errorHandler));
  }

  getUserFilterListing(post: Object) {
    let params = JSON.stringify(post);
    return this._httpClient.get<any>(this._userFilterListing_get_url + "?paramsMap=" + encodeURIComponent(params)).pipe(catchError(this.errorHandler));
  }

  getPolicyListing(policySource, post: Object) {
    let url = "";

    if (policySource == "group") {
      url = this._policylisting_group_get_url;
    } else {
      url = this._policylisting_self_get_url;
    }
    var queryParams = [];
    for (var p in post)
      if (post.hasOwnProperty(p)) {
        queryParams.push(encodeURIComponent(p) + "=" + encodeURIComponent(post[p]));
      }

    return this._httpClient.get<any>(url).pipe(catchError(this.errorHandler));
  }

  updateStatus(post: Object): Observable<any> {
    return this._httpClient.post<any>(this._user_update_status_url,
      post,
      {
        responseType: 'json'
      }
    ).pipe(catchError(this.errorHandler));
  }

  sendResetPasswordMail(post: Object): Observable<any> {
    return this._httpClient.post<any>(this._reset_password_mail_url,
      post,
      {
        responseType: 'json'
      }
    ).pipe(catchError(this.errorHandler));
  }

  sendActicationMail(post: Object): Observable<any> {
    return this._httpClient.post<any>(this._send_activation_mail_url,
      post,
      {
        responseType: 'json'
      }
    ).pipe(catchError(this.errorHandler));
  }

  getActiveOrInactive(row) {
    if (row) {
      if (row["currentState"] == "Draft") {
        return null;
      }
      if (row["currentState"] == "Active") {
        return "Make Inactive";
      } else {
        return "Make Active";
      }
    }
    return null;
  }

  isSendResetPassword(user) {
    if (user) {
      if (user["currentState"] == "Active") {
        return "Reset Password";
      }
    }
    return null;
  }
  isSendValidationEmail(user) {
    if (user) {
      if (user["currentState"] == "Sent for Validation") {
        return "Resend Validation Email";
      }
    }
    return null;
  }

  searchInArray(key, value, arr) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i][key] === value) {
        return arr[i];
      }
    }
    return null;
  }
  errorHandler(error: HttpErrorResponse) {
    return throwError(error.message);
  }
}
