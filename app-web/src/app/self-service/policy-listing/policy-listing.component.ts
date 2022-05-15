import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { TableViewService } from 'src/app/app-widgets/table/table-view/table-view.service';
import { ServiceResponse } from 'src/app/common/service-response';
import { UserService } from 'src/app/common/user.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-policy-listing',
  templateUrl: './policy-listing.component.html',
  styleUrls: ['./policy-listing.component.css']
})
export class PolicyListingComponent implements OnInit {
  @Input() policy_source: string;

  constructor(
    private _tableService: TableViewService,
    private _spinnerService: NgxSpinnerService,
    private _userService: UserService,
    private _router: Router,

  ) { }

  ngOnInit(): void {
    this.getPolicyList();
  }

  ngOnDestroy(): void {
    this._tableService.unsubscribeTableData();
  }
  private getPolicyList() {

    this._spinnerService.show();

    this._userService.getPolicyListing(this.policy_source,{}).subscribe((res) => {

      this._spinnerService.hide();
      if (res.status === ServiceResponse.STATUS_SUCCESS) {
        let policyList = res.response.data;
        let headerList = res.response.header ? res.response.header : [];
        headerList.push({ type: 'options', displayName: 'Actions' });
        let optionsMenuData = [];
        optionsMenuData.push({ name: 'view', owner: 'view', displayName: 'View', icon: 'visibility', handler: this.viewClick });
        optionsMenuData.push({ name: 'gencoi', displayName: 'Generate COI', handler: null });
        optionsMenuData.push({ name: 'transactions', displayName: 'Transaction List', handler: null });

        let config = {};
        config['headerList'] = headerList;
        config['menuList'] = optionsMenuData;
        config['pageSize'] = 10;
        this.emitTableData(policyList, config, null);
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

  viewClick=()=> {
    this._router.navigate(['add-policy'], { state: {"policySource":this.policy_source, "readonly":true} });
  }
}
