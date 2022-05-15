import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RulesComponent } from './rules/rules.component';
import { IPRRouting } from './ipr.routing';
import { MaterialModule } from '../angular-material/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { NgDynamicBreadcrumbModule } from 'ng-dynamic-breadcrumb';
import { RegistrationModule } from '../registration/registration.module';
import { ProcessRulesComponent } from './rules/process/process-rules.component';
import { CalRfpComponent } from './rules/calendar-rfp/cal-rfp.component';
import { CalrfprulesComponent } from './rules/calendar-rfp/list/calrfprules.component';
import { EvalCriteriaListComponent } from './rules/eval-criteria/eval-criteria-list/eval-criteria-list.component';
import { EvalCriteriaViewComponent } from './rules/eval-criteria/eval-criteria-view/eval-criteria-view.component';
import { CalrfprulesViewComponent } from './rules/calendar-rfp/view/calrfprules-view.component';
import { ProcessRulesListComponent } from './rules/process/list/process-rules-list.component';
import { ProcessRulesViewComponent } from './rules/process/view/process-rules-view.component';
import { QualCriteriaComponent } from './rules/qual-crtiteria/qual-criteria/qual-criteria.component';
import { QualCriteriaViewComponent } from './rules/qual-crtiteria/qual-criteria-view/qual-criteria-view.component';
import { IprDocumentListComponent } from './rules/document/list/ipr-document-list/ipr-document-list.component';
import { IprDocumentViewComponent } from './rules/document/view/ipr-document-view/ipr-document-view.component';
import { IprDocTempComponent } from './rules/doc-temp/view/ipr-doc-temp/ipr-doc-temp.component';
import { CloseBtnComponent } from '../app-widgets/close-btn/close-btn.component';
import { MisReportComponent } from './report/mis-report/mis-report.component';
import { CommentsListComponent } from '../app-widgets/comments-list/comments-list.component';
import { EventCalendarComponent } from '../app-widgets/event-calendar/event-calendar.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { IprProcessComponent } from './ipr-process/ipr-process.component';
import { ListingComponent } from './ipr-process/listing/listing.component';
import { CreateComponent } from './ipr-process/create/create.component';
import { WidgetsComponent } from './ipr-process/widgets/widgets.component';
import { CalendarViewComponent } from './ipr-process/widgets/calendar-view/calendar-view.component';
import { DiscussionComponent } from './ipr-process/widgets/discussion/discussion.component';
import { QuickIprComponent } from './ipr-process/create/quick-ipr/quick-ipr.component';
import { FilterComponent } from './ipr-process/listing/filter/filter.component';
import { CreateIprComponent } from './ipr-process/create/create-ipr/create-ipr.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatPaginatorModule} from '@angular/material/paginator';
import { CommModModule } from '../comm-mod/comm-mod.module';
import { IprSettingsComponent } from './ipr-settings/ipr-settings.component';
import { CalRuleCustomComponent } from './ipr-process/widgets/cal-rule-custom/cal-rule-custom.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MaintainCalComponent } from './ipr-process/maintain-cal/maintain-cal.component';


@NgModule({ 
  declarations: [ 
    RulesComponent,   
    CalrfprulesComponent, 
    ProcessRulesComponent,  
    CalRfpComponent,
    EvalCriteriaListComponent,   
    EvalCriteriaViewComponent,
    CalrfprulesViewComponent,
    ProcessRulesListComponent,
    ProcessRulesViewComponent,
    QualCriteriaComponent,
    QualCriteriaViewComponent,
    IprDocumentListComponent,
    IprDocumentViewComponent,
    IprDocTempComponent,
    CloseBtnComponent,
    CommentsListComponent,
    MisReportComponent,
    EventCalendarComponent,
    MisReportComponent,
    IprProcessComponent,
    ListingComponent,
    CreateComponent,
    WidgetsComponent,
    CalendarViewComponent,
    DiscussionComponent,
    QuickIprComponent,
    FilterComponent,
    CreateIprComponent,
    IprSettingsComponent,
    CalRuleCustomComponent,
    MaintainCalComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
    NgDynamicBreadcrumbModule,
    RegistrationModule,
    IPRRouting,
    FormsModule,
    MatProgressBarModule,
    MatPaginatorModule,
    CommModModule,
    MatDatepickerModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  providers: [DatePipe]
})
export class IprModModule { }
