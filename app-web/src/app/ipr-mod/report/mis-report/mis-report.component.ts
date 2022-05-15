import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { TableViewComponent } from 'src/app/app-widgets/table/table-view/table-view.component';
import { TableViewService } from 'src/app/app-widgets/table/table-view/table-view.service';
import { APP_URL } from 'src/app/common/app-urls/app-urls';
import { ServiceResponse } from 'src/app/common/service-response';
import { environment } from 'src/environments/environment';
import { IprReportService } from '../ipr-report.service';
import swal from 'sweetalert2';
import { RulesService } from '../../rules/rules.service';

@Component({
  selector: 'app-mis-report',
  templateUrl: './mis-report.component.html',
  styleUrls: ['./mis-report.component.css']
})
export class MisReportComponent implements OnInit {

  iprReportDataList = []
  hideReg:boolean = false;

  constructor(
    private _tableService: TableViewService,
    private _spinnerService: NgxSpinnerService,
    private _router: Router,
    private _reportServ: IprReportService
  ) { }

  ngOnInit(): void {
    this.getIPRMISReport();
  }

  ngOnDestroy(): void {
    this._tableService.unsubscribeTableData();
  }

  private getIPRMISReport() {

    let _url = environment.baseUrl + APP_URL.BUSINESS_GET_IPR_MIS_REPORT;
    this._spinnerService.show();

    this._reportServ.getIPRMISReport(_url).subscribe((res) => {

      if (res.status === ServiceResponse.STATUS_SUCCESS) {

        this.iprReportDataList = res.response.data;

        let headerList = res.response.header? res.response.header: [];

        headerList.push({ type: 'options', displayName: 'Actions' });

        let optionsMenuData = [];
        optionsMenuData.push({ name: 'view', owner: 'viewipr', displayName: 'View', icon: 'visibility', handler: this.viewIPR });
        
        let config = {};
        config['headerList'] = headerList;
        config['menuList'] = optionsMenuData;
        config['pageSize'] = 5;
        this.emitTableData(this.iprReportDataList, config, null);      
      }
      else {
        swal.fire({ text: res.error, icon: 'error' });
      }
      this._spinnerService.hide();
    })
  }

  viewIPR = () => {
    this._tableService.selRecord["id"]=this._tableService.selRecord["ruleId"];
    this._router.navigate([RulesService.RULE_LINK[ this._tableService.selRecord["ruleName"]]]);
  }

  emitTableData(_data: Array<Object>, _config: Object, that: any) {

    let data = new Object();
    data['data'] = _data;
    data['config'] = _config;
    if (that) {
      that._tableService.emitTableData(data);
    }
    else {
      this._tableService.emitTableData(data);
    }
  }

}
