import { ModuleWithProviders, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  
  { path: '', redirectTo: 'login', pathMatch: 'full'  },
  {
    path: 'login',
    loadChildren: './usermanagement/usermanagement.module#UsermanagementModule',
  },
  {
    path: 'dashboard',
    loadChildren: './registration/registration.module#RegistrationModule',
  },
  {
    path: 'self-service',
    loadChildren: './self-service/self-service.module#SelfServiceModule',
  },
  {
    path: 'ipr',
    loadChildren: './ipr/ipr-mod.module#IprModModule',
  },
];

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
// })
// export class AppRoutingModule { }
export const AppRoutingModule: ModuleWithProviders = RouterModule.forRoot(routes)

