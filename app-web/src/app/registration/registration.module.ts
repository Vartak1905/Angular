import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddClientComponent } from './add-client/add-client.component';
import { CompanyRegistrationFormComponent } from './forms/company-registration-form/company-registration-form.component';
import { RequestDashboardComponent } from './request-dashboard/request-dashboard.component';
import { PerformerHistoryComponent } from '../pages/performer-history/performer-history.component';
import { routing } from '../registration/registration.routing';
import { MaterialModule } from '../angular-material/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { CellService, ColumnFilterService, DynamicTableModule } from 'material-dynamic-table';
import { OptionsCellComponent } from '../app-widgets/table/cells/options-cell/options-cell.component';
import { DateFilterComponent } from '../app-widgets/table/filter/date-filter/date-filter.component';
import { TextFilterComponent } from '../app-widgets/table/filter/text-filter/text-filter.component';
import { ImageViewerComponent } from '../common/image-viewer/image-viewer.component';
import { TableViewComponent } from '../app-widgets/table/table-view/table-view.component';
import {NgDynamicBreadcrumbModule} from "ng-dynamic-breadcrumb";
import { MatPaginatorModule } from '@angular/material/paginator';



@NgModule({
  declarations: [
    RegisterComponent,
    DashboardComponent,
    AddClientComponent,
    CompanyRegistrationFormComponent,
    PerformerHistoryComponent,
    RequestDashboardComponent,
    OptionsCellComponent,
    DateFilterComponent,
    TextFilterComponent,
    ImageViewerComponent,
    TableViewComponent
  ],
  exports: [
    RegisterComponent,
    DashboardComponent,
    AddClientComponent,
    CompanyRegistrationFormComponent,
    PerformerHistoryComponent,
    RequestDashboardComponent,
    TableViewComponent
  ],
  schemas: [],
  imports: [
    CommonModule,
    routing,
    MaterialModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
    DynamicTableModule,
    MatPaginatorModule,
    NgDynamicBreadcrumbModule
  ],
  entryComponents: [
    OptionsCellComponent,
    TextFilterComponent,
    DateFilterComponent
  ],
})
export class RegistrationModule { 
  constructor(
    private readonly _cellService: CellService,
    private readonly _columnFilterService: ColumnFilterService
  ) {
    _cellService.registerCell('options', OptionsCellComponent);
    _columnFilterService.registerFilter('string', TextFilterComponent);
    _columnFilterService.registerFilter('date', DateFilterComponent);
  }
}
