import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { TableViewService } from 'src/app/app-widgets/table/table-view/table-view.service';
import { RulesService } from '../../rules.service';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { APP_URL } from 'src/app/common/app-urls/app-urls';
import { ServiceResponse } from 'src/app/common/service-response';
import { LovFetcherService } from 'src/app/common/lov-fetcher/lov-fetcher.service';

@Component({
  selector: 'app-eval-criteria-list',
  templateUrl: './eval-criteria-list.component.html',
  styleUrls: ['./eval-criteria-list.component.css']
})
export class EvalCriteriaListComponent implements OnInit {
  headerList = [
    
  ];
  data: object[] = [
    
  ];
  disableAddBtn: boolean;
  lovDataObj:object;
  constructor(
    private _tableService: TableViewService,
    private _spinnerService: NgxSpinnerService,
    private _router: Router,
    private _rulesService: RulesService,
    private _lovService: LovFetcherService
  ) { }

  ngOnInit(): void {
    this.getRuleList();
    // this.getLovData();
  }
  ngOnDestroy() : void {
    this._tableService.unsubscribeTableData();
  }
  getLovData() {

    this._spinnerService.show();
    let _url = environment.baseUrl + APP_URL.BUSINESS_LOV_PROCESS_RULES;
    this._lovService.getLovList(_url).subscribe(res => {
      this._spinnerService.hide();
      if (res.status === ServiceResponse.STATUS_SUCCESS) {

        let data = res.response.data;
        this.lovDataObj = data;

      } else {
        swal.fire({ text: res.error, icon: 'error' });
      }
    });
  }
  addNewRules() {
    this._router.navigate(['/evalcriterias/view'], { state: {add_new_rule: true} });
  }
  addNewRulesOld() {
    this._spinnerService.show();
    let _url = environment.baseUrl + APP_URL.ADD_NEW_RULE;
    let body = {
      iprRuleType:"eval-criteria"
    };
    this._rulesService.saveRules(_url, body).subscribe((res) => {
      this._spinnerService.hide();
      if (res.status === ServiceResponse.STATUS_SUCCESS) {
        this.getRuleList();
      }
    }, (err) => { 
      this._spinnerService.hide();
    })
  }
  getRuleList () {
    this._spinnerService.show();
  
    let _url = environment.baseUrl + APP_URL.IPR_RULE_LISTING;
    let _formData = {};
    _formData['iprRuleType'] = 'eval-criteria';
    this._rulesService.fetchRules(_url, _formData).subscribe(res => {

      this._spinnerService.hide();
      if (res.status === ServiceResponse.STATUS_SUCCESS) {
        this.headerList = res.response.header ? res.response.header : [];
        this.data = res.response.data ? res.response.data : [];
        this.headerList.push({ type: 'options', displayName: 'Actions' });

        let optionsMenuData = [];
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
    this._router.navigate(['/evalcriterias/view']);
  }
  emitTableData(_data: Array<Object>, _config: Object, that: any) {
    let data = new Object();
    data['data'] = _data;
    data['config'] = _config;
    this._tableService.emitTableData(data);
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


}
