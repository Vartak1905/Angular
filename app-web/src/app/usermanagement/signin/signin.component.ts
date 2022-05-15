import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceResponse } from 'src/app/common/service-response';
import { HttpParams } from '@angular/common/http';
import { UserService } from 'src/app/common/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import swal from 'sweetalert2';
import { Location } from '@angular/common';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {


  constructor(
    private _fb: FormBuilder,
    private _userService: UserService,
    private _spinnerService: NgxSpinnerService,
    private _location: Location,
  ) { }

  signinFormGroup: FormGroup;

  ngOnInit(): void {
    this.addFormFields();
  }

  addFormFields() {
    this.signinFormGroup = this._fb.group({
      emailAddress: ['', [Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
    });
  }

  sendResetPassword() {

    if (this.signinFormGroup.valid) {
      this._spinnerService.show();

      let emailAddress = this.signinFormGroup.value['emailAddress'];

      let body = new HttpParams();
      body = body.set('emailAddress', emailAddress);
      this._userService.sendResetPasswordMail(body).subscribe(res => {
        if (res.status === ServiceResponse.STATUS_SUCCESS) {
          swal.fire({
            text: 'Reset Password Mail Successfully Sent.',
            icon: 'success',
            onClose: () => {
              this._location.back();
            }
          });
        } else {
          swal.fire(res.error, 'failure');
        }
        this._spinnerService.hide();
      }, error => {
        this._spinnerService.hide();
      });
    }
  }
}
