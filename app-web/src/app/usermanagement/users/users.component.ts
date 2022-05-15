import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { TableViewService } from 'src/app/app-widgets/table/table-view/table-view.service';
import { APP_URL } from 'src/app/common/app-urls/app-urls';
// import { DashboardService } from 'src/app/common/dashboard-service/dashboard.service';
import { ServiceResponse } from 'src/app/common/service-response';
import { UserService } from 'src/app/common/user.service';
import { environment } from 'src/environments/environment';
import { ColumnFilterComponent } from '../column-filter/column-filter.component';
import swal from 'sweetalert2';
import { HttpParams } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  usersList = [];
  originalHeaderList = [];
  headerList = [];
  tempHeaderList = [];
  totalRow: number = 0;
  pageIndex: number = 0
  filterObj = {
    pageNumber: 1,
    fieldName: '',
    fieldValue: '',
    fieldValueType: '',
    className: 'com.dev.cqr.models.user.Teams',
    filterData: []
  }
  constructor(
    private _tableService: TableViewService,
    private userService: UserService,
    private _spinnerService: NgxSpinnerService,
    private _dialog: MatDialog,
    private _router: Router,
    private _userService: UserService,
    private _snackBar: MatSnackBar,
    // private _dashboardService: DashboardService
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit(): void {
    this.tempHeaderList = null;
    this.getUserList();
  }

  ngOnDestroy(): void {
    this._tableService.unsubscribeTableData();
  }
  handlePageChange($event) {
    this.filterObj.pageNumber = $event.pageIndex + 1;
    this.pageIndex = $event.pageIndex;
    this.getUserList();
  }
  clearFilter(i) {
    let config = {};
    config['headerList'] = [];
    config['menuList'] = [];
    config['pageSize'] = 10;
    config['pageIndex'] = 0;
    config['totalRow'] = this.totalRow;
    this.emitTableData([], config, null);

    if (this.filterObj.filterData.length == 1) {
      this.filterObj.filterData = [];
      this.document.location.reload();
    } else {
      this.filterObj.filterData.splice(i, 1);
    }

    this.filterObj.pageNumber = 1;
    this.pageIndex = 0;
    this.getUserList();
  }
  _filterCallback = (data, filterData, cancel = false) => {
    let config = {};
    config['headerList'] = [];
    config['menuList'] = [];
    config['pageSize'] = 10;
    config['pageIndex'] = 0;
    config['totalRow'] = this.totalRow;
    this.emitTableData([], config, null);

    if (!cancel) {
      let obj = {
        fieldName: data.column,
        fieldValue: data.value,
        className: filterData.column.className,
        fieldValueType: filterData.column.type
      };
      let index = this.filterObj.filterData.findIndex(row => row.fieldName == data.column);
      if (index == -1) {
        this.filterObj.filterData.push(obj);
      } else {
        this.filterObj.filterData[index] = obj;
      }
    } else {
      let index = this.filterObj.filterData.findIndex(row => row.fieldName == data.column);
      if (index != -1) {
        this.filterObj.filterData.splice(index, 1);
      }
    }
    this.filterObj.pageNumber = 1;
    this.pageIndex = 0;
    this.getUserList();
  }
  private getUserList() {

    this._spinnerService.show();
    let _url = environment.baseUrl + APP_URL.USERS_LISTING;
    this.userService.getUserFilterListing(this.filterObj).subscribe((res) => {
      // this._dashboardService.getClientListing(_url).subscribe((res) => {

      this._spinnerService.hide();
      if (res.status === ServiceResponse.STATUS_SUCCESS) {
        this.usersList = res.response.data;
        this.totalRow = res.response.totalRows ? res.response.totalRows : this.usersList.length;
        this.originalHeaderList = res.response.data;
        if (this.headerList.length == 0) {
          this.headerList = res.response.header ? res.response.header : [];
          this.headerList.forEach(element => {
            element['check'] = true;
          });
        }
        this.originalHeaderList = res.response.header ? res.response.header : [];
        this.tempHeaderList = this.tempHeaderList ? this.tempHeaderList : this.headerList;

        this.resetTableData(this.usersList, this.tempHeaderList);

      }
      else {
        swal.fire(res.response.error, 'failure');
      }
    }, (err) => {
      this._spinnerService.hide();
    })
  }
  openDialog() {
    if (this.headerList.length == 0) {
      return false;
    }
    this._dialog.open(ColumnFilterComponent, {
      data: this.headerList,
      width: '30%',
      height: '80vh',
      closeOnNavigation: true,
      hasBackdrop: false
    }).afterClosed().subscribe(result => {
      this.headerList = result;
      this.removeHeaders();
    });
  }

  removeHeaders() {
    this.tempHeaderList = this.headerList.filter(element => element["check"] == true);
    let optionData = this._userService.searchInArray("type", "options", this.headerList);
    this.tempHeaderList.push(optionData);
    this._tableService.emitColumnsData(this.tempHeaderList);
  }


  editClick = () => {
    this._router.navigate(['edit-user']);
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


  resetTableData(dataList, headerList) {
    if (!this._userService.searchInArray("type", "options", headerList)) {
      headerList.push({ type: 'options', displayName: 'Actions' });
    }

    let optionsMenuData = [];
    optionsMenuData.push({ name: 'validationMail', displayName: 'Resend Validation Email', icon: 'contact_mail', handler: this.resendValidationEmail, menuAction: this.isSendValidationEmail });
    optionsMenuData.push({ name: 'edit', displayName: 'Edit/View', icon: 'visibility', handler: this.editClick });
    optionsMenuData.push({ name: 'activeInactive', displayName: 'Active', icon: 'edit', handler: this.updateStatus, menuAction: this.getActiveOrInactive });
    optionsMenuData.push({ name: 'resetPassword', displayName: 'Reset Password', icon: 'lock', handler: this.resetPasswordMail, menuAction: this.isSendResetPassword });
    optionsMenuData.push({ name: 'delete', displayName: 'Delete', icon: 'delete', handler: this.deleteUser });

    let config = {};
    config['headerList'] = headerList;
    config['menuList'] = optionsMenuData;
    config['pageSize'] = 10;
    config['pageIndex'] = this.pageIndex;
    config['totalRow'] = this.totalRow;
    this._tableService._filterCallback = this._filterCallback;
    this.emitTableData(dataList, config, null);
  }

  addNewUser() {
    this._tableService.selRecord = null;
    this._router.navigate(['add-user']);
  }

  getActiveOrInactive = (row) => {
    return this._userService.getActiveOrInactive(row);
  }

  deleteUser = () => {
    if (this._tableService.selRecord) {

      swal.fire({
        text: "Are you sure you want to delete user?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          let paramsMap = { "itemId": this._tableService.selRecord["id"] };
          paramsMap["currentState"] = "Deleted";
          this._spinnerService.show();
          this._userService.updateStatus(paramsMap).subscribe(res => {
            if (res.status === ServiceResponse.STATUS_SUCCESS) {
              this._snackBar.open('User deleted successfully', "Dismiss", {
                duration: 2000,
              });
              this.refreshUser();
            } else {
              swal.fire(res.error, 'failure');
              this._spinnerService.hide();
            }

          });
        }
      })
    }
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
          
          this.refreshUser();
          
        } else {
          swal.fire(res.error, 'failure');
          this._spinnerService.hide();
        }

      });
    }
  };

  resetPasswordMail = () => {
    if (this._tableService.selRecord) {
      let snackBarRef = this._snackBar.open('Sending....', 'Dismiss');
      let body = new HttpParams();
      body = body.set('emailAddress', this._tableService.selRecord["emailAddress"]);
      this._userService.sendResetPasswordMail(body).subscribe(res => {
        if (res.status === ServiceResponse.STATUS_SUCCESS) {
          swal.fire({
            text: 'Reset Password Mail Successfully Sent.',
            icon: 'success',
          });
          snackBarRef.dismiss();
        } else {
          swal.fire(res.error, 'failure');
          snackBarRef.dismiss();
        }
      });
    }
  }

  isSendResetPassword = (row) => {
    return this._userService.isSendResetPassword(row);
  }
  isSendValidationEmail = (row) => {
    return this._userService.isSendValidationEmail(row);
  }

  resendValidationEmail = () => {
    if (this._tableService.selRecord) {
      let snackBarRef = this._snackBar.open('Sending....', 'Dismiss');
      let body = new HttpParams();
      body = body.set('emailAddress', this._tableService.selRecord["emailAddress"]);
      this._userService.sendActicationMail(body).subscribe(res => {
        if (res.status === ServiceResponse.STATUS_SUCCESS) {
          swal.fire({
            text: 'Validation Mail Successfully Sent.',
            icon: 'success',
          });
          snackBarRef.dismiss();
        } else {
          swal.fire(res.error, 'failure');
          snackBarRef.dismiss();
        }
      });
    }
  }

  refreshUser() {
    let config = {};
    config['headerList'] = [];
    config['menuList'] = [];
    config['pageSize'] = 10;
    config['pageIndex'] = 0;
    config['totalRow'] = this.totalRow;
    this.emitTableData([], config, null);
    this.getUserList();
  }
}
