import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { ProcessRulesComponent } from './rules/process/process-rules.component';
import { CalRfpComponent } from './rules/calendar-rfp/cal-rfp.component';
import { EvalCriteriaViewComponent } from './rules/eval-criteria/eval-criteria-view/eval-criteria-view.component';
import { EvalCriteriaListComponent } from './rules/eval-criteria/eval-criteria-list/eval-criteria-list.component';
import { CalrfprulesComponent } from './rules/calendar-rfp/list/calrfprules.component';
import { CalrfprulesViewComponent } from './rules/calendar-rfp/view/calrfprules-view.component';
import { ProcessRulesListComponent } from './rules/process/list/process-rules-list.component';
import { ProcessRulesViewComponent } from './rules/process/view/process-rules-view.component';
import { QualCriteriaComponent } from './rules/qual-crtiteria/qual-criteria/qual-criteria.component';
import { QualCriteriaViewComponent } from './rules/qual-crtiteria/qual-criteria-view/qual-criteria-view.component';
import { IprDocumentViewComponent } from './rules/document/view/ipr-document-view/ipr-document-view.component';
import { IprDocumentListComponent } from './rules/document/list/ipr-document-list/ipr-document-list.component';
import { IprDocTempComponent } from './rules/doc-temp/view/ipr-doc-temp/ipr-doc-temp.component';
import { MisReportComponent } from './report/mis-report/mis-report.component';
import { ListingComponent } from './ipr-process/listing/listing.component';
import { QuickIprComponent } from './ipr-process/create/quick-ipr/quick-ipr.component';
import { CreateIprComponent } from './ipr-process/create/create-ipr/create-ipr.component';
import { IprSettingsComponent } from './ipr-settings/ipr-settings.component';
import { MaintainCalComponent } from './ipr-process/maintain-cal/maintain-cal.component';
import { RuleVersionViewGuard } from './rules/rule-version-view.guard';


export const routes: Routes = [
  {
    path: 'ipr-settings/:name', component: IprSettingsComponent, data: {
      title: 'IPR Settings',
      breadcrumb: [
        {
          label: 'Home',
          url: '/request-dashboard'
        },
        {
          label: 'IPR List',
          url: '/ipr/list'
        },
        {
          label: 'IPR Settings',
          url: 'ipr-settings/:name'
        }
      ]
    }
  },
  {
    path: 'evalcriterias', component: EvalCriteriaListComponent, canActivate:[RuleVersionViewGuard], data: {
      title: 'Evaluation Criteria',
      breadcrumb: [
        {
          label: 'Home',
          url: '/evalcriterias'
        },
        {
          label: 'IPR Settings',
          url: '/evalcriterias'
        }
      ]
    }
  },
  {
    path: 'evalcriterias/view', component: EvalCriteriaViewComponent, data: {
      title: 'Evaluation Criteria',
      breadcrumb: [
        {
          label: 'Home',
          url: '/evalcriterias'
        },
        {
          label: 'IPR Settings',
          url: '/evalcriterias'
        },
        {
          label: 'Evaluation Criteria',
          url: '/evalcriterias/view'
        }
      ]
    }
  },
  {
    path: 'qualfcriterias', component: QualCriteriaComponent, canActivate:[RuleVersionViewGuard], data: {
      title: 'Qualification Criteria',
      breadcrumb: [
        {
          label: 'Home',
          url: '/qualfcriterias'
        },
        {
          label: 'IPR Settings',
          url: '/qualfcriterias'
        }
      ]
    }
  },
  {
    path: 'qualfcriterias/view', component: QualCriteriaViewComponent, data: {
      title: 'Evaluation Criteria',
      breadcrumb: [
        {
          label: 'Home',
          url: '/qualfcriterias'
        },
        {
          label: 'IPR Settings',
          url: '/qualfcriterias'
        },
        {
          label: 'Qualification Criteria',
          url: '/qualfcriterias/view'
        }
      ]
    }
  },
  {
    path: '', component: ProcessRulesComponent,
    children: [
      {
        path: 'processrules/view',
        component: ProcessRulesViewComponent,
        data: {
          title: 'Process Rules',
          breadcrumb: [
            {
              label: 'Home',
              url: '/processrules'
            },
            {
              label: 'IPR Settings',
              url: '/processrules'
            },
            {
              label: 'Process Rules',
              url: '/processrules/view'
            }
          ]
        }
      },
      {
        path: 'processrules', component: ProcessRulesListComponent,canActivate:[RuleVersionViewGuard], data: {
          title: 'IPR Rule List', breadcrumb: [
            {
              label: 'Home',
              url: '/processrules'
            },
            {
              label: 'IPR Settings',
              url: '/processrules'
            }
          ]
        },
      },
    ]
  },
  {
    path: '', component: CalRfpComponent,
    children: [
      {
        path: 'calrfprules/view', component: CalrfprulesViewComponent, data: {
          title: 'Process Rules',
          breadcrumb: [
            {
              label: 'Home',
              url: '/calrfprules'
            },
            {
              label: 'IPR Settings',
              url: '/calrfprules'
            },
            {
              label: 'Calendar Rules (RFP)',
              url: '/calrfprules/view'
            }
          ]
        },
      },
      {
        path: 'calrfprules', component: CalrfprulesComponent, canActivate:[RuleVersionViewGuard],data: {
          title: 'Calendar RFP Rule List',
          breadcrumb: [
            {
              label: 'Home',
              url: '/calrfprules'
            },
            {
              label: 'IPR Settings',
              url: '/calrfprules'
            },
          ]
        }
      }
    ],
  },
  {
    path: 'iprdocuments', component: IprDocumentListComponent,
    canActivate:[RuleVersionViewGuard],
    data: {
      title: 'IPR Rule List', breadcrumb: [
        {
          label: 'Home',
          url: '/iprdocuments'
        },
        {
          label: 'IPR Settings',
          url: '/iprdocuments'
        }
      ]
    },
  },
  {
    path: 'iprdocument/view', component: IprDocumentViewComponent,
    data: {
      title: 'IPR Document',
      breadcrumb: [
        {
          label: 'Home',
          url: '/iprdocuments'
        },
        {
          label: 'IPR Settings',
          url: '/iprdocuments'
        },
        {
          label: 'IPR Document',
          url: '/iprdocument/view'
        }
      ]
    }
  },
  {
    path: 'iprdocumenttemp/view', component: IprDocTempComponent,
    data: {
      title: 'IPR Document Template',
      breadcrumb: [
        {
          label: 'Home',
          url: '/iprdocumenttemp/view'
        },
        {
          label: 'IPR Settings',
          url: '/iprdocumenttemp/view'
        },
        {
          label: 'IPR Document Template',
          url: '/iprdocumenttemp/view'
        }
      ]
    }
  },
  {
    path: 'qualfcriterias', component: QualCriteriaComponent,
    canActivate:[RuleVersionViewGuard],
    data: {
      title: 'IPR Rule List', breadcrumb: [
        {
          label: 'Home',
          url: '/qualfcriterias'
        },
        {
          label: 'IPR Settings',
          url: '/qualfcriterias'
        }
      ]
    },
  },
  {
    path: 'qualfcriterias/view', component: QualCriteriaViewComponent,
    data: {
      title: 'Qualification Criteria',
      breadcrumb: [
        {
          label: 'Home',
          url: '/qualfcriterias'
        },
        {
          label: 'IPR Settings',
          url: '/qualfcriterias'
        },
        {
          label: 'Qualification Criteria',
          url: '/qualfcriterias/view'
        }
      ]
    }
  },
  {
    path: 'mis/iprreport', component: MisReportComponent,
    data: {
      title: 'View IPR Setting Changes Report',
      breadcrumb: [
        {
          label: 'Home',
          url: '/iprdocuments'
        },
        {
          label: 'MIS',
          url: '/mis/report'
        },
        {
          label: 'View IPR Setting Changes Report',
          url: '/mis/report'
        }
      ]
    }
  },
  {
    path: 'ipr/list', component: ListingComponent,
    data: {
      title: 'View IPR Listing',
      breadcrumb: [
        {
          label: 'Home',
          url: '/request-dashboard'
        },
        {
          label: 'IPR',
          url: '/ipr/view'
        },
        {
          label: 'List',
          url: '/ipr/view'
        }
      ]
    }
  },
  {
    path: 'ipr/create', component: CreateIprComponent,
    data: {
      title: 'View IPR Listing',
      breadcrumb: [
        {
          label: 'Home',
          url: '/request-dashboard'
        },
        {
          label: 'IPR',
          url: '/ipr/list'
        },
        {
          label: 'Manual',
          url: '/ipr/create'
        }
      ]
    }
  },
  {
    path: 'ipr/quick', component: QuickIprComponent,
    data: {
      title: 'View IPR Listing',
      breadcrumb: [
        {
          label: 'Home',
          url: '/request-dashboard'
        },
        {
          label: 'IPR',
          url: '/ipr/list'
        },
        {
          label: 'Quick',
          url: '/ipr/quick'
        }
      ]
    }
  },
  {
    path: 'ipr/maint-cal', component: MaintainCalComponent,
    data: {
      title: 'Maintain Calendar',
      breadcrumb: [
        {
          label: 'Home',
          url: '/request-dashboard'
        },
        {
          label: 'IPR',
          url: '/ipr/list'
        },
        {
          label: 'Maintain Calendar',
          url: '/ipr/maint-cal'
        }
      ]
    }
  },
];

declare module "@angular/core" {
  interface ModuleWithProviders<T = any> {
    ngModule: Type<T>;
    providers?: Provider[];
  }
}
export const IPRRouting: ModuleWithProviders = RouterModule.forChild(routes)