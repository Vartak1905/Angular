import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { TableViewService } from 'src/app/app-widgets/table/table-view/table-view.service';
import { DashboardService } from 'src/app/common/dashboard-service/dashboard.service';
import { ServiceResponse } from 'src/app/common/service-response';
import { UserService } from 'src/app/common/user.service';
import swal from 'sweetalert2';
//import { DashboardService } from 'src/app/common/dashboard-service/dashboard.service';
@Component({
  selector: 'app-user-listing',
  templateUrl: './user-listing.component.html',
  styleUrls: ['./user-listing.component.css']
})
export class UserListingComponent implements OnInit {

  @Input() role_name: string;

  constructor(
    private _tableService: TableViewService,
    private _spinnerService: NgxSpinnerService,
    private _userService: UserService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getUserList();
  }

  ngOnDestroy(): void {
    this._tableService.unsubscribeTableData();
  }

  private getUserList() {

    this._spinnerService.show();

    this._userService.getUserListing({ roleName: this.role_name }).subscribe((res) => {

      this._spinnerService.hide();
      if (res.status === ServiceResponse.STATUS_SUCCESS) {

        let usersList = res.response.data;
        let headerList = res.response.header ? res.response.header : [];
        headerList.push({ type: 'options', displayName: 'Actions' });
        let optionsMenuData = [];
        optionsMenuData.push({ name: 'activeInactive', displayName: 'Active', icon: 'edit', handler: this.updateStatus, menuAction: this.getActiveOrInactive });

        let config = {};
        config['headerList'] = headerList;
        config['menuList'] = optionsMenuData;
        config['pageSize'] = 10;
        this.emitTableData(usersList, config, null);
      }
      else {
        swal.fire(res.response.error, 'failure');
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

  getActiveOrInactive = (row) => {
    return this._userService.getActiveOrInactive(row);
  }

  updateStatus = () => {

    if (this._tableService.selRecord) {

      let paramsMap = { "itemId": this._tableService.selRecord["id"] };
      let curStatus = this._tableService.selRecord["currentState"];

      if (curStatus == "Active") {
        paramsMap["currentState"] = "Inactive";
      } else {
        paramsMap["currentState"] = "Active";
      }

      this._spinnerService.show();
      this._userService.updateStatus(paramsMap).subscribe(res => {

        if (res.status === ServiceResponse.STATUS_SUCCESS) {
          
          this._snackBar.open('Status updated successfully', "Dismiss", {
            duration: 2000,
          });
          this.getUserList();
        } else {
          swal.fire(res.error, 'failure');
          this._spinnerService.hide();
        }

      });
    }
  };
}
