import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import * as CryptoJS from 'crypto-js';
import { EntryPointsService } from 'src/app/entry-points/entry-points.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ServiceResponse } from 'src/app/common/service-response';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
import { APP_URL } from 'src/app/common/app-urls/app-urls';
import { AppLayoutService } from 'src/app/app-layout/app-layout.service';
import { UserService } from 'src/app/common/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _spinnerService: NgxSpinnerService,
    private _entrypointService: EntryPointsService,
    private _snackBar: MatSnackBar,
    private _cookieService: CookieService,
    private _layoutService: AppLayoutService,
    private _userService: UserService
  ) { }

  loginDetails: FormGroup;

  ngOnInit(): void {

    this.addFormFields();
    let token = this._cookieService.get('access-token');
    if (token) {
      this.validateToken();
    } else {
      this.resetLoginPage();
    }
  }

  private validateToken() {
    let wrapperEle = document.getElementsByClassName("cq-custom-cont-wrapper")[0];
    wrapperEle.classList.add('cq-login-custom-wrapper');
    let _url = environment.baseUrl + APP_URL.USER_CURRENT_FETCH;
    let paramObj = {};
    this._spinnerService.show();
    this._userService.fecthUser(_url, JSON.stringify(paramObj)).subscribe(res => {
      this._spinnerService.hide();
      if (res.status === ServiceResponse.STATUS_SUCCESS) {
        this._layoutService.updateMenu(true);
        wrapperEle.classList.remove('cq-login-custom-wrapper');
      } else {
        this.resetLoginPage();
      }
    }, (err) => {
      this.resetLoginPage();
      this._spinnerService.hide();
    });
  }
  private resetLoginPage() {
    this._cookieService.delete('access-token');
    let wrapperEle = document.getElementsByClassName("cq-custom-cont-wrapper")[0];
    wrapperEle.classList.add('cq-login-custom-wrapper');
  }

  private addFormFields() {

    this.loginDetails = this._fb.group({
      userId: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  login() {

    if (this.loginDetails.valid) {

      let timekey = new Date().getTime();
      this.encryptPassword(timekey);

      let formData = {};
      formData['username'] = this.loginDetails.value['userId'];
      formData['password'] = this.loginDetails.value['password'];
      formData['radio'] = timekey;

      this._spinnerService.show();
      this._entrypointService.login(formData).subscribe(res => {

        this._spinnerService.hide();
        if (res.status === ServiceResponse.STATUS_SUCCESS) {

          let data = res.response;
          this._cookieService.set("access-token", data.token, 30, "", "", false, "Lax")
          this._router.navigate(["/"]);
          this._layoutService.updateMenu(true);
          this.getUserDetails();

          let wrapperEle = document.getElementsByClassName("cq-custom-cont-wrapper")[0];
          wrapperEle.classList.remove('cq-login-custom-wrapper');

        } else {
          if (res.error) {
            this._snackBar.open(res.error, "Dismiss", {
              duration: 2000,
            });
          } else {
            this._snackBar.open("Invalid credentials", "Dismiss", {
              duration: 2000,
            });
          }
        }
      });
    }
  }

  private encryptPassword(timekey: Number) {

    let _key = CryptoJS.enc.Utf8.parse('lod' + timekey);
    let _iv = CryptoJS.enc.Utf8.parse(timekey + 'not');

    let encrypted = CryptoJS.AES.encrypt(
      this.loginDetails.get('password').value, _key, {
      keySize: 16,
      iv: _iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    this.loginDetails.get('password').setValue(encrypted.toString())
  }

  private getUserDetails() {

    this._spinnerService.show();
    let _url = environment.baseUrl + APP_URL.UMGMT_GET_USER_DETAILS;

    this._layoutService.getUserDetails(_url).subscribe(res => {

      this._spinnerService.hide();
      if (res.status === ServiceResponse.STATUS_SUCCESS) {
        this._layoutService.user = res.response.data;
        this._layoutService.user["itemType"] = res.response["itemType"];
        this._layoutService.emitLoggedUser(this._layoutService.user);
      }
    });
  }


}
