import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { TableViewService } from 'src/app/app-widgets/table/table-view/table-view.service';
import { RulesService } from '../../rules.service';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { APP_URL } from 'src/app/common/app-urls/app-urls';
import { ServiceResponse } from 'src/app/common/service-response';

@Component({
  selector: 'app-qual-criteria',
  templateUrl: './qual-criteria.component.html',
  styleUrls: ['./qual-criteria.component.css']
})
export class QualCriteriaComponent implements OnInit {
  headerList = [
    
  ];
  data: object[] = [
    
  ];
  disableAddBtn: boolean;
  constructor(
    private _tableService: TableViewService,
    private _spinnerService: NgxSpinnerService,
    private _router: Router,
    private _rulesService: RulesService,
  ) { }

  ngOnInit(): void {
    this.getRuleList();
    // this.getLovData();
  }
  ngOnDestroy() : void {
    this._tableService.unsubscribeTableData();
  }
  addNewRules() {
    this._router.navigate(['/qualfcriterias/view'], { state: {add_new_rule: true} });
  }
  addNewRulesOld() {
    let _url = environment.baseUrl + APP_URL.ADD_NEW_RULE;
    let body = {
      iprRuleType:"qualif-criteria"
    };
    this._rulesService.saveRules(_url, body).subscribe((res) => {
      this._spinnerService.hide();
      if (res.status === ServiceResponse.STATUS_SUCCESS) {
        this.getRuleList();
      }
    }, (err) => { 
    })
  }
  getRuleList () {
    this._spinnerService.show();
  
    let _url = environment.baseUrl + APP_URL.IPR_RULE_LISTING;
    let _formData = {};
    _formData['iprRuleType'] = 'qualif-criteria';
    this._rulesService.fetchRules(_url, _formData).subscribe(res => {

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

        this._spinnerService.hide();
        

      } else {
        swal.fire({ text: res.error, icon: 'error' });
        this._spinnerService.hide();
      
      }
    }, (err) => {
      this._spinnerService.hide();
    });
    
  }
  handleMenu = () => {
    this._router.navigate(['/qualfcriterias/view']);
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
