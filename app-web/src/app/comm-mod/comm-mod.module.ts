import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChkPaginatorComponent } from '../app-widgets/chk-paginator/chk-paginator.component';
import { MaterialModule } from '../angular-material/material/material.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ProgressStepComponent } from '../app-widgets/progress-step/progress-step.component';



@NgModule({
  declarations: [
    ChkPaginatorComponent,
    ProgressStepComponent
  ],
  imports: [
    MaterialModule,
    MatPaginatorModule,
    CommonModule
  ],
  exports:[
    ChkPaginatorComponent,
    ProgressStepComponent
  ]
})
export class CommModModule { }
