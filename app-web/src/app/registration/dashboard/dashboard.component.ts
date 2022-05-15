import { Component, OnInit } from '@angular/core';
import { TableViewService } from '../../app-widgets/table/table-view/table-view.service';
import { DashboardService } from '../../common/dashboard-service/dashboard.service';
import { environment } from '../../../environments/environment';
import { APP_URL } from '../../common/app-urls/app-urls';
import { ServiceResponse } from '../../common/service-response';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { PerformerHistoryComponent } from 'src/app/pages/performer-history/performer-history.component';
import { Router } from '@angular/router';
import { AppLayoutService } from 'src/app/app-layout/app-layout.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  orgListList = []
  hideReg:boolean = false;
  constructor(
    private _tableService: TableViewService,
    private _dashboardService: DashboardService,
    private _spinnerService: NgxSpinnerService,
    private _dialog: MatDialog,
    private _router: Router,
    private _layoutService: AppLayoutService
  ) { }

  ngOnInit(): void {
    this.getClientList();
    if (this._layoutService.user) {
      let roles = this._layoutService.user['roleList'];
      let index = roles.findIndex(item => item.name == "Business Development Leader");
      if (index != -1) {
        this.hideReg = true;
      } else {
        this.hideReg = false;
      }
    }
  }

  ngOnDestroy(): void {
    this._tableService.unsubscribeTableData();
  }

  private getClientList() {

    let _url = environment.baseUrl + APP_URL.BUSINESS_GET_CLIENT_LISTING;
    this._spinnerService.show();

    this._dashboardService.getClientListing(_url).subscribe((res) => {

      if (res.status === ServiceResponse.STATUS_SUCCESS) {

        this.orgListList = res.response.data;
        let headerList = res.response.header? res.response.header: [];

        headerList.push({ type: 'options', displayName: 'Actions' });

        let optionsMenuData = [];
        optionsMenuData.push({ name: 'edit', owner: 'addclient', displayName: 'View / Edit', icon: 'visibility', page: "dashboard", handler: this.editClick });
        optionsMenuData.push({ name: 'process', displayName: 'Performer History', icon: 'create', page: "dashboard", handler: this.historyClick });

        let config = {};
        config['headerList'] = headerList;
        config['menuList'] = optionsMenuData;
        config['pageSize'] = 5;
        this.emitTableData(this.orgListList, config, null);      
      }
      else {

      }
      this._spinnerService.hide();
    })
  }

  editClick = () => {
    this._router.navigate(['add-client']);
  }

  historyClick = () => {

    if (this._dialog.openDialogs.length == 0) {
      this._dialog.open(PerformerHistoryComponent, {

        width: '80%',
        height: '80vh'

      }).afterClosed().subscribe(result => {
        this._tableService.emitIsOptionSelect(false);
      });
    }
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
