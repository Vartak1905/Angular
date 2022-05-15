import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { CompanyComponent } from './company/company.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { AddPolicyComponent } from './add-policy/add-policy.component';
import { PolicyDashboardComponent } from './policy-dashboard/policy-dashboard.component';

export const routes: Routes = [
    { path: 'view-edit', component: CompanyComponent },
    { path: 'update-profile', component: EditUserComponent,data: {
        title: 'Update Profile',
        breadcrumb: [
          {
            label: 'Users',
            url: 'user-list'
          },
          {
            label: 'Update Profile',
            url: 'update-profile'
          }
        ]
      }, 
    },
    { path: 'add-policy', component: AddPolicyComponent,data: {
        title: 'Add Policy',
        breadcrumb: [
          {
            label: 'Policy Dashboard',
            url: 'policy-dashboard'
          },
          {
            label: 'Add Policy',
            url: 'add-policy'
          }
        ]
      }, 
    },
    { path: 'policy-dashboard', component: PolicyDashboardComponent }
];

declare module "@angular/core" {
    interface ModuleWithProviders<T = any> {
        ngModule: Type<T>;
        providers?: Provider[];
    }
}
export const SelfServiceRoutingModule: ModuleWithProviders = RouterModule.forChild(routes)
