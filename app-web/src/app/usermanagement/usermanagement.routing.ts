import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { UsersComponent } from './users/users.component';
import { AddUserComponent } from './add-user/add-user.component';
import { ImportUserComponent } from './import-user/import-user.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SigninComponent } from './signin/signin.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'user-list', component: UsersComponent },
    { path: 'edit-user', component: AddUserComponent },
    { path: 'signin', component: SigninComponent },
    { path: 'add-user', component: AddUserComponent,data: {
        title: 'Add/Edit User',
        breadcrumb: [
          {
            label: 'User List',
            url: 'user-list'
          },
          {
            label: 'Add User',
            url: 'add-user'
          }
        ]
      },
    },
    { path: 'upload-user', component: ImportUserComponent,data: {
        title: 'Upload User',
        breadcrumb: [
          {
            label: 'User List',
            url: 'user-list'
          },
          {
            label: 'Upload User',
            url: 'upload-user'
          }
        ]
      }, },
    { path: 'reset-password', component: ResetPasswordComponent },
];

declare module "@angular/core" {
    interface ModuleWithProviders<T = any> {
        ngModule: Type<T>;
        providers?: Provider[];
    }
}
export const Routing: ModuleWithProviders = RouterModule.forChild(routes)
