import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginComponent } from './login/login.component';
import { Routing } from './usermanagement.routing';
import { MaterialModule } from '../angular-material/material/material.module';
import { UsersComponent } from './users/users.component';
import { AddUserComponent } from './add-user/add-user.component';
import { ImportUserComponent } from './import-user/import-user.component';
import { RegistrationModule } from '../registration/registration.module';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ColumnFilterComponent } from './column-filter/column-filter.component';
import { BrowserModule } from '@angular/platform-browser';

import { ReactiveFormsModule } from '@angular/forms';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import {NgDynamicBreadcrumbModule} from "ng-dynamic-breadcrumb";
import { SigninComponent } from './signin/signin.component';

@NgModule({
  declarations: [LoginComponent, UsersComponent, AddUserComponent, ImportUserComponent,ResetPasswordComponent, ColumnFilterComponent, SigninComponent],
  imports: [
    CommonModule,
    BrowserModule,
    NgDynamicBreadcrumbModule,
    Routing,
    MaterialModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
    RegistrationModule
  ]
})
export class UsermanagementModule { }
