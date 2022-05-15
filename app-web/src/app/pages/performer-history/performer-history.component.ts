import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ColumnConfig, DynamicTableComponent } from 'material-dynamic-table';
import { NgxSpinnerService } from 'ngx-spinner';
import { FilteredDataSource } from 'src/app/app-widgets/table/datasource/filtered-data-source';
import { TableViewService } from 'src/app/app-widgets/table/table-view/table-view.service';
import { APP_URL } from 'src/app/common/app-urls/app-urls';
import { PerformerHistoryService } from 'src/app/common/performer-history-service/performer-history.service';
import { ServiceResponse } from 'src/app/common/service-response';
import { environment } from 'src/environments/environment';
import swal from 'sweetalert2';

@Component({
  selector: 'app-performer-history',
  templateUrl: './performer-history.component.html',
  styleUrls: ['./performer-history.component.css']
})
export class PerformerHistoryComponent implements OnInit {

  dataList: object[] = [];
  columns: ColumnConfig[] = [];

  dataSource: FilteredDataSource<Object>;

  constructor(
    public dialogRef: MatDialogRef<PerformerHistoryComponent>,
    private _tableService: TableViewService,
    private _perHisService: PerformerHistoryService,
    private _spinnerService: NgxSpinnerService,
  ) {}

  ngOnInit(): void {
    
    if (this._tableService.selRecord != null && this._tableService.selMenu) {

      let _url = environment.baseUrl + APP_URL.PERFORMER_HISTORY;
      let paramObj = {};
      paramObj['itemId'] = this._tableService.selRecord["id"];
      paramObj['itemType'] = this._tableService.selRecord["itemType"];

      this._spinnerService.show();
      this._perHisService.fetchPerformerHistory(_url, JSON.stringify(paramObj)).subscribe(res => {
        if (res.status === ServiceResponse.STATUS_SUCCESS) {

          this.dataList = res.response.data;
          this.columns = res.response.header;
          this.dataSource = new FilteredDataSource(this.dataList);

        } else {
          swal.fire(res.response.error, 'failure');
        }
        this._spinnerService.hide();
      });
    }
  }
  closeDialogue() {
    this.dialogRef.close();
  }
  updatePerformerHistOnTable() {

  }

}
