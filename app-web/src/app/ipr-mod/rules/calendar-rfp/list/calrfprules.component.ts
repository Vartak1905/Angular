import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { TableViewService } from 'src/app/app-widgets/table/table-view/table-view.service';
import { APP_URL } from 'src/app/common/app-urls/app-urls';
import { ServiceResponse } from 'src/app/common/service-response';
import { RulesService } from 'src/app/ipr-mod/rules/rules.service';
import { environment } from 'src/environments/environment';
import swal from 'sweetalert2';

@Component({
  selector: 'app-calrfprules',
  templateUrl: './calrfprules.component.html',
  styleUrls: ['./calrfprules.component.css']
})
export class CalrfprulesComponent implements OnInit {

  usersList = [];
  disableAddBtn:boolean = true;
  headerList = [
    
  ];
  data: object[] = [
    
  ];

  constructor(
    private _tableService: TableViewService,
    private _spinnerService: NgxSpinnerService,
    private _router: Router,
    private _rulesService: RulesService
  ) { }

  ngOnInit(): void {
    this.getRuleList();
  }
  ngOnDestroy(): void {
    this._tableService.unsubscribeTableData();
  }
  getRuleList () {
    this._spinnerService.show();
    let _url = environment.baseUrl + APP_URL.IPR_RULE_LISTING;
    let _formData = {};
    _formData['iprRuleType'] = 'calendar-rfp';

    this._rulesService.fetchRules(_url, _formData).subscribe(res => {

      this._spinnerService.hide();
      if (res.status === ServiceResponse.STATUS_SUCCESS) {
        this.headerList = res.response.header ? res.response.header : [];
        this.headerList = this.headerList.filter(item => item["name"] != "publishCount");
        this.data = res.response.data ? res.response.data : [];
        this.headerList.push({ type: 'options', displayName: 'Actions' });

        let optionsMenuData = [];
        // optionsMenuData.push({ name: 'validationMail', displayName: 'Edit/Publish', icon: 'contact_mail', handler: null, menuAction: null });
        // optionsMenuData.push({ name: 'edit', displayName: 'View', icon: 'visibility', handler: this.editClick });
        optionsMenuData.push({
          name: 'activeInactive',
          displayName: 'Active',
          icon: 'edit',
          handler: this.handleMenu,
          menuAction: this.getActiveOrInactive
        });
        let config = {};
        config['headerList'] = this.headerList;
        config['menuList'] = optionsMenuData;
        config['pageSize'] = 10;
  
        let filterData =this.data.filter((item:any) => {
          return item.currentState == 'Draft';
        });
        if (filterData.length > 0) {
          this.disableAddBtn = true;
        } else {
          this.disableAddBtn = false;
        }
        this.emitTableData(this.data, config, null);

        

      } else {
        swal.fire({ text: res.error, icon: 'error' });
      }
    }, (err) => {
      this._spinnerService.hide();
    });
    
  }
  handleMenu = () => {
    this._router.navigate(['/calrfprules/view']);
  }
   getActiveOrInactive(row) {
    if (row) {
      if (row["currentState"] == "Draft") {
        return 'Edit/Publish';
      } else if (row["currentState"] == "Active" || row['currentState'] == 'InActive') {
        return "View";
      } else {
        return null;
      }
    }
    return null;
  }

  emitTableData(_data: Array<Object>, _config: Object, that: any) {
    let data = new Object();
    data['data'] = _data;
    data['config'] = _config;
    this._tableService.emitTableData(data);

  }

  editClick() {

  }

  addNewRules() {
    this._router.navigate(['/calrfprules/view'], { state: {add_new_rule: true} });
  }

  addNewRulesNew() {
    if (this.disableAddBtn == false) {
      this._spinnerService.show();
      let _url = environment.baseUrl + APP_URL.ADD_NEW_RULE;
      let body = {
        iprRuleType:"calendar-rfp"
      };
      this._rulesService.saveRules(_url, body).subscribe((res) => {
        this._spinnerService.hide();
        if (res.status === ServiceResponse.STATUS_SUCCESS) {
          this.getRuleList();
        }
      }, (err) => { 
      })

    }
  }

}
