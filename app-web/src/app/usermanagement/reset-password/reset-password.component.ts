import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppLayoutService } from 'src/app/app-layout/app-layout.service';
import { APP_URL } from 'src/app/common/app-urls/app-urls';
import { EntryPointsService } from 'src/app/entry-points/entry-points.service';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';
import { ServiceResponse } from 'src/app/common/service-response';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  
  private token: string;
  hidePass: Boolean = true;
  hideConfirmPass: Boolean = true;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _route: ActivatedRoute,
    private _spinnerService: NgxSpinnerService,
    private _entrypointService: EntryPointsService,
    private _snackBar: MatSnackBar,
    private _cookieService: CookieService,
    private _layoutService: AppLayoutService
  ) { }

  resetPasswordDetails: FormGroup;

  ngOnInit(): void {
    this.addFormFields();
    this.getQueryParam();
  }

  addFormFields() {
    this.resetPasswordDetails = this._fb.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    }, { validator: this.checkPasswords });
  }

  getQueryParam() {
    this.token = this._route.snapshot.queryParams.token;
  }

  resetPassword() {

    if (this.resetPasswordDetails.valid) {

      let timekey = new Date().getTime();
      this.encryptPassword(timekey);
      let password = this.resetPasswordDetails.value['confirmPassword'];
      let confirmPassword = this.resetPasswordDetails.value['confirmPassword']
      if (password != confirmPassword) {
        return;
      }
      let formData = {};
      formData['password'] = this.resetPasswordDetails.value['confirmPassword'];
      formData['radio'] = timekey;
      formData['resetPasswordToken'] = this.token;

      this._spinnerService.show();
      this._entrypointService.resetPassword(formData).subscribe(res => {

        this._spinnerService.hide();
        if (res.status === ServiceResponse.STATUS_SUCCESS) {
          this._router.navigate(["login"]);
        } else {
          this._snackBar.open("Invalid input", "Dismiss", {
            duration: 2000,
          });
        }
      },
        error => {
          this._spinnerService.hide();
        }
      );
    }
  }

  private encryptPassword(timekey: Number) {

    let _key = CryptoJS.enc.Utf8.parse('lod' + timekey);
    let _iv = CryptoJS.enc.Utf8.parse(timekey + 'not');

    let encrypted = CryptoJS.AES.encrypt(
      this.resetPasswordDetails.get('confirmPassword').value, _key, {
      keySize: 16,
      iv: _iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    this.resetPasswordDetails.get('confirmPassword').setValue(encrypted.toString())
  }

  checkPasswords(group: FormGroup) {
    let pass = group.get('password').value;
    let confirmPass = group.get('confirmPassword').value;

    return pass === confirmPass ? null : { notSame: true }
  }
}
