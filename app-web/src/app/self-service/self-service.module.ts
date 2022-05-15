import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyComponent } from './company/company.component';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SelfServiceRoutingModule } from './self-service.routing';
import { MaterialModule } from '../angular-material/material/material.module';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { EditUserComponent } from './edit-user/edit-user.component';
import { UserListingComponent } from './user-listing/user-listing.component';
import { RegistrationModule } from '../registration/registration.module';
import { AddPolicyComponent } from './add-policy/add-policy.component';
import { PolicyDashboardComponent } from './policy-dashboard/policy-dashboard.component';
import { PolicyListingComponent } from './policy-listing/policy-listing.component';
import { NgDynamicBreadcrumbModule } from "ng-dynamic-breadcrumb";


@NgModule({
  declarations: [
    EditUserComponent, 
    UserListingComponent, 
    CompanyComponent, 
    AddPolicyComponent, 
    PolicyDashboardComponent, 
    PolicyListingComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    BrowserModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
    SelfServiceRoutingModule,
    RegistrationModule,
    NgDynamicBreadcrumbModule
  ]
})
export class SelfServiceModule { }
