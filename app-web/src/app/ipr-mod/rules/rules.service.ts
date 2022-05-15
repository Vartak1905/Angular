import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { APP_URL } from 'src/app/common/app-urls/app-urls';

@Injectable({
  providedIn: 'root'
})
export class RulesService {

  public static RULE_LINK = {
    'Process': '/processrules/view', 'Calendar RFP': '/calrfprules/view', 'Calendar RA': '', 'Qualification Criteria': '/qualfcriterias/view',
    'Evaluation Criteria': '/evalcriterias/view', 'IPR-Document': '/iprdocument/view'
  };

  private _attachment_get_url: string = environment.baseUrl + APP_URL.BUSINESS_ATTACHMENT_GET_ATT;

  constructor(
    public _httpClient: HttpClient
  ) { }

  saveRules(_url: string, params: any): Observable<any> {
    return this._httpClient.post<any>(_url, params).pipe(catchError(this.errorHandler));
  }

  fetchRules(_url: string, _formData: any): Observable<any> {
    return this._httpClient.get<any>(_url, {
      responseType: 'json',
      params: {
        'paramsMap': JSON.stringify(_formData)
      }
    }).pipe(catchError(this.errorHandler));
  }

  getAllAttachments(_url: string, _formData: any): Observable<any> {
    return this._httpClient.get<any>(_url, {
      responseType: 'json',
      params: {
        'paramsMap': JSON.stringify(_formData)
      }
    }).pipe(catchError(this.errorHandler));
  }


  fetchRulePost(_url: string, _formData: any): Observable<any> {
    return this._httpClient.post<any>(_url,
      JSON.stringify(_formData)
    ).pipe(catchError(this.errorHandler));
  }

  deleteAttachment(_url: string, _formData: any): Observable<any> {

    return this._httpClient.post<any>(_url, _formData,
      {
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

  fetchIPRLIsting(_url: string, _formData: any): Observable<any> {
    return this._httpClient.get<any>(_url, {
      responseType: 'json',
      params: {
        'paramsMap': JSON.stringify(_formData)
      }
    }).pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error.message);
  }

  isValidCalRules(calRules) {
    let formValid = false;
    let message = '';

    let rules = calRules?.rulesCombList[0]['ruleList'];
    for (let i = 0; i < rules.length; i++) {
      if (rules[i].iprRulesOpList[0]?.value) {
        if (i != 0) {
          if (Number(rules[i].iprRulesOpList[0]?.value) > Number(rules[i - 1].iprRulesOpList[0]?.value)) {
            formValid = true;
            message = '';
          } else {
            formValid = false;
            message = calRules['rulesCombList'][0].ruleList[i]['ruleName'] + " Value Should be greater than " + calRules['rulesCombList'][0].ruleList[i - 1]['ruleName'];
            break;
          }
        } else {
          formValid = true;
          message = '';
        }
      } else {
        formValid = false;
        message = 'Please fill all rule values';
        break;
      }
    }

    return { valid: formValid, message };
  }
}
