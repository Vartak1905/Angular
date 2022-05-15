import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { RegisterComponent } from './register/register.component';
import { AddClientComponent } from './add-client/add-client.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RequestDashboardComponent } from './request-dashboard/request-dashboard.component';

export const routes: Routes = [
    { path: 'register', component: RegisterComponent,data: {
        title: 'Register Business Entity',
        breadcrumb: [
          {
            label: 'Login',
            url: 'login'
          },
          {
            label: 'Register',
            url: 'register'
          }
        ]
      },
   },
    { path: 'add-client', component: AddClientComponent,data: {
        title: 'Register Business Entity',
        breadcrumb: [
          {
            label: 'Dashboard',
            url: 'dashboard'
          },
          {
            label: 'Add Client',
            url: 'add-client'
          }
        ]
      },
   },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'request-dashboard', component: RequestDashboardComponent },
];

declare module "@angular/core" {
    interface ModuleWithProviders<T = any> {
        ngModule: Type<T>;
        providers?: Provider[];
    }
}
export const routing: ModuleWithProviders = RouterModule.forChild(routes)