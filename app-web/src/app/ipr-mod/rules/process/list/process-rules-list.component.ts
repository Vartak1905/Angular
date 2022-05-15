import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { TableViewService } from 'src/app/app-widgets/table/table-view/table-view.service';
import { ServiceResponse } from 'src/app/common/service-response';
import { environment } from 'src/environments/environment';
import { APP_URL } from 'src/app/common/app-urls/app-urls';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { RulesService } from '../../rules.service';

@Component({
  selector: 'app-process-rules-list',
  templateUrl: './process-rules-list.component.html',
  styleUrls: ['./process-rules-list.component.css']
})
export class ProcessRulesListComponent implements OnInit {

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
    _formData['iprRuleType'] = 'process';

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
    this._router.navigate(['/processrules/view']);
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
    this._router.navigate(['processrules/view'], { state: {add_new_rule: true} });
  }
  addNewRules2() {
    if (this.disableAddBtn == false) {
      this._spinnerService.show();
      // this._router.navigate(['/viewrules']);
      let _url = environment.baseUrl + APP_URL.ADD_NEW_RULE;
      let body = {
        iprRuleType:"process"
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
