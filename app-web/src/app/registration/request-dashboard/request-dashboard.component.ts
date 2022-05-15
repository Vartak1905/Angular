import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { DashboardService } from 'src/app/common/dashboard-service/dashboard.service';
import { TableViewService } from 'src/app/app-widgets/table/table-view/table-view.service';
import { environment } from 'src/environments/environment';
import { APP_URL } from 'src/app/common/app-urls/app-urls';
import { ServiceResponse } from 'src/app/common/service-response';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request-dashboard',
  templateUrl: './request-dashboard.component.html',
  styleUrls: ['./request-dashboard.component.css']
})
export class RequestDashboardComponent implements OnInit {

  constructor(
    private _tableService: TableViewService,
    private _dashboardService: DashboardService,
    private _spinnerService: NgxSpinnerService,
    private _router: Router,
  ) { }

  ngOnInit(): void {
    this.getPendingRequest();
  }
  
  ngOnDestroy(): void {
    this._tableService.unsubscribeTableData();
  }

  private getPendingRequest() {
    this.emitTableData([], {}, null);
    let _url = environment.baseUrl + APP_URL.PENDING_REQUEST;
    this._spinnerService.show();

    this._dashboardService.getPendingRequest(_url).subscribe((res) => {
      this._spinnerService.hide();
      if (res.status === ServiceResponse.STATUS_SUCCESS) {

        let dataList = res.response.data;
        let headerList = res.response.header ? res.response.header: [];
        headerList.push({ type: 'options', displayName: 'Options' });

        let optionsMenuData = [];
        optionsMenuData.push({ name: 'preview', owner: 'addclient-req', displayName: 'Preview Request', icon: 'visibility', handler: this.viewClick });

        let config = {};
        config['headerList'] = headerList;
        config['menuList'] = optionsMenuData;
        config['pageSize'] = 5;
        this.emitTableData(dataList, config, null);
      }
      else {

      }
    }, (err) => {
      this._spinnerService.hide();
    })
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

  viewClick=()=>{
    this._router.navigate(['add-client']);
  }
}
