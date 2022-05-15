import { Component, OnInit } from '@angular/core';
import { LovFetcherService } from 'src/app/common/lov-fetcher/lov-fetcher.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { APP_URL } from 'src/app/common/app-urls/app-urls';
import { ServiceResponse } from 'src/app/common/service-response';
import { MatSnackBar } from '@angular/material/snack-bar';
import swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { TableViewService } from 'src/app/app-widgets/table/table-view/table-view.service';
import { AppLayoutService } from 'src/app/app-layout/app-layout.service';
import { DatePipe, Location } from '@angular/common';
import { RulesService } from '../rules/rules.service';
import { CommentService } from 'src/app/common/comment/comment.service';

@Component({
  selector: 'app-ipr-settings',
  templateUrl: './ipr-settings.component.html',
  styleUrls: ['./ipr-settings.component.css']
})
export class IprSettingsComponent implements OnInit {

  constructor(
    private _router: Router,
    private _lovService: LovFetcherService,
    private _spinnerService: NgxSpinnerService,
    private _rulesService: RulesService,
    private _tableService: TableViewService,
    private _layoutService: AppLayoutService,
    private _matSnackbar: MatSnackBar,
    private _location: Location,
    private _activeRoute: ActivatedRoute,
    private _commService: CommentService) {

    let navData = this._router.getCurrentNavigation();
    if (navData && navData.extras && navData.extras.state) {

      if (navData.extras.state.insurance_cat) {
        this.insurance_cat = navData.extras.state.insurance_cat;
        this.insurance_cat_sel = navData.extras.state.insurance_cat_sel;
      }
      if (navData.extras.state.insurance_plan_cat) {
        this.insurance_plan_cat = navData.extras.state.insurance_plan_cat;
        this.insurance_plan_cat_sel = navData.extras.state.insurance_plan_cat_sel;
      }
    }
  }
  
  rulesObj: any;
  lovDataObj: object = {};
  disableForm: Boolean = false;
  hidePublish: Boolean = false;
  selectCombIndex: number = null;
  combination_rules: Array<object> = [];
  scores_obj = {};
  weight_sum: number = 0;
  weight_id: any = null;
  operators_list = [];
  indexObj: object = {};
  colSpan: object = {};
  arithmetic_list = [];
  show_inputs: boolean = false;
  is_published: boolean = false;
  ipr_type: string = 'process';
  insurance_cat: any;
  insurance_plan_cat: any;
  insurance_cat_sel: string = '';
  insurance_plan_cat_sel: string = '';
  is_admin: boolean = false;

  ngOnInit(): void {
    this.ipr_type = this._activeRoute.snapshot.paramMap.get('name');
    this.getLovData();
  }

  private getLovData() {

    this._spinnerService.show();
    let _url = environment.baseUrl + APP_URL.BUSINESS_LOV_PROCESS_RULES;
    this._lovService.getLovList(_url).subscribe(res => {
      this._spinnerService.hide();
      if (res.status === ServiceResponse.STATUS_SUCCESS) {

        let data = res.response.data;
        this.lovDataObj = data;

        this.lovDataObj["scores"] = this.lovDataObj["scores"].sort((e1, e2) => e1.itemPosition > e2.itemPosition ? 1 : -1);
        this.lovDataObj["scores"].forEach(element => {
          if (element.itemValue == 'weight') {
            this.weight_id = element.id;
          }
          this.scores_obj[element.id] = { value: element.itemValue, label: element.itemName };
        });
        this.fetchRules();

      } else {
        swal.fire({ text: res.error, icon: 'error' });
      }
    });
  }

  sortData() {

    this.arithmetic_list = this.rulesObj['rulesCombList'][0]['ruleList'][0]['iprRulesOpList'];
    this.arithmetic_list = this.arithmetic_list.sort((e1, e2) => e1.position > e2.position ? 1 : -1);
    this.rulesObj['rulesCombList'].forEach(element => {
      element['ruleList'].forEach(optList => {
        optList['iprRulesOpList'] = optList['iprRulesOpList'].sort((e1, e2) => e1.position > e2.position ? 1 : -1);
      });
    });
  }

  makeOperators() {

    let data = this.rulesObj['rulesCombList'][0]['ruleList'][0]['iprRulesOpList'];
    for (let i = 0; i < data.length; i++) {
      if (this.colSpan[data[i].label]) {
        this.colSpan[data[i].label] = this.colSpan[data[i].label] + 1;
      } else {
        this.colSpan[data[i].label] = 1;
      }
      if (data[i + 1]) {
        if (data[i].label != data[i + 1].label) {
          this.indexObj[i] = true;
        }
      }
    }
  }

  fetchRules() {

    this._spinnerService.show();
    let _url = environment.baseUrl + APP_URL.BUSINESS_RULES_FETCH;

    let _formData = {};
    if (this.ipr_type == 'process') {
      _formData['iprRuleType'] = 'process';
    } else if (this.ipr_type == 'calendar') {
      _formData['iprRuleType'] = 'calendar-rfp';
    } else if (this.ipr_type == 'qualification') {
      _formData['iprRuleType'] = 'qualif-criteria';
    } else if (this.ipr_type == 'evaluation') {
      _formData['iprRuleType'] = 'eval-criteria';
    }

    this._rulesService.fetchRules(_url, _formData).subscribe(res => {

      this._spinnerService.hide();
      if (res.status === ServiceResponse.STATUS_SUCCESS) {
        let data = res.response.data;
        this.rulesObj = data;
        if (this.ipr_type == 'qualification' || this.ipr_type == 'evaluation') {
          this.selectIndex();
        } else {
          this.selectCombIndex = 0;
        }
        this.combination_rules = JSON.parse(JSON.stringify(this.rulesObj['rulesCombList']));


        let ruleList = this.rulesObj['rulesCombList'][0]['ruleList'];
        ruleList.forEach(rule => {
          if (rule['iprRulesOpList'][0]['ruleDataType']['itemValue'] == 'dropdown') {
            rule.iprRulesOpList[0].value = parseInt(rule.iprRulesOpList[0].value);
          }
        });
        this.sortData();
        this.makeOperators();
        this.calculateWeight();
        this.show_inputs = true;

      } else {
        swal.fire({ text: res.error, icon: 'error' });
      }
    });
  }

  selectIndex() {

    for (let index = 0; index < this.rulesObj['rulesCombList'].length; index++) {
      if (this.rulesObj['rulesCombList'][index]['field1Value'] == this.insurance_cat && this.rulesObj['rulesCombList'][index]['field2Value'] == this.insurance_plan_cat) {
        this.selectCombIndex = index;
        break;
      }
    }
    if (!this.selectCombIndex) {
      this.selectCombIndex = 0;
      // this.insurance_cat = this.rulesObj['rulesCombList'][0]['field1Value'];
      // this.insurance_plan_cat = this.rulesObj['rulesCombList'][0]['field2Value'];
    }
  }

  validateForm() {

    let formValid = false;
    let message = '';
    for (let i = 0; i < this.combination_rules[this.selectCombIndex]['ruleList'].length; i++) {
      for (let j = 0; j < this.combination_rules[this.selectCombIndex]['ruleList'][i]['iprRulesOpList'].length; j++) {
        if (this.combination_rules[this.selectCombIndex]['ruleList'][i]['iprRulesOpList'][j]['value']) {
          if (this.combination_rules[this.selectCombIndex]['ruleList'][i]['iprRulesOpList'][j]['ruleDataType']['itemValue'] == 'number') {
            formValid = !isNaN(this.combination_rules[this.selectCombIndex]['ruleList'][i]['iprRulesOpList'][j]['value']);
            message = formValid ? message = '' : message = 'Please enter number';
          } else {
            formValid = true;
          }

        } else {
          formValid = false;
          message = 'Please filled all values';
          break;
        }
      }
      if (!formValid) {
        break;
      }
    }
    return { valid: formValid, message };
  }

  validateProcess() {

    let formValid = false;
    let message = '';
    for (let i = 0; i < this.rulesObj['rulesCombList'][0]['ruleList'].length; i++) {
      if (this.rulesObj['rulesCombList'][0]['ruleList'][i]['iprRulesOpList'][0]['value']) {
        formValid = true;
        message = '';
      } else {
        formValid = false;
        message = 'Please filled all the value';
        break;
      }
    }
    return { valid: formValid, message };
  }

  onBeforeRuleSave() {

    let formValid = { valid: false, message: '' };
    if (this.ipr_type != 'evaluation') {
      formValid = this.validateProcess();
    } else {
      formValid = this.validateForm();
    }

    if (!formValid.valid) {
      this._matSnackbar.open(formValid.message, "Dismiss", {
        duration: 2000,
      });
      return false;
    }
    if (this.weight_sum != 100 && this.ipr_type == 'evaluation') {
      this._matSnackbar.open('Total Weight should be 100', "Dismiss", {
        duration: 2000,
      });
      return false;
    }
    this.saveRules();
  }

  handleChange(item, index, subindex) {

    if (item.label != this.weight_id && this.arithmetic_list[subindex] && this.arithmetic_list[subindex]['arithOperator']) {
      let operator = this.arithmetic_list[subindex]['arithOperator'];
      let oprIndex = 0;
      if (operator == "<") {
        oprIndex = subindex - 1;
      } else if (operator == "<=") {
        oprIndex = subindex + 1;
      } else if (operator == ">") {
        oprIndex = subindex - 1;
      }
      if (this.combination_rules[this.selectCombIndex]['ruleList'][index]['iprRulesOpList'][oprIndex] && this.combination_rules[this.selectCombIndex]['ruleList'][index]['iprRulesOpList'][oprIndex]['label'] != this.weight_id) {
        this.combination_rules[this.selectCombIndex]['ruleList'][index]['iprRulesOpList'][oprIndex]['value'] = item.value;
      }
    }
  }

  calculateWeight() {

    this.weight_sum = 0;
    let filterArr = this.combination_rules[this.selectCombIndex]['ruleList'].filter(
      item => item["isActive"] == true
    );
    filterArr.forEach(element => {
      let index = element['iprRulesOpList'].findIndex(item => item.label == this.weight_id);
      if (index != -1) {
        this.weight_sum += element['iprRulesOpList'][index]['value'] ? Number(element['iprRulesOpList'][index]['value']) : 0;
      }
    });
  }

  saveRules() {

    if (this.ipr_type == 'evaluation' || this.ipr_type == 'qualification') {
      this.rulesObj["rulesCombList"] = this.combination_rules;
    }
    this._spinnerService.show();
    let _url = environment.baseUrl + APP_URL.BUSINESS_SAVE_RULES;

    this._rulesService.saveRules(_url, this.rulesObj).subscribe(res => {
      this._spinnerService.hide();
      if (res.status === ServiceResponse.STATUS_SUCCESS) {
        swal.fire({
          text: 'Rules saved successsfully',
          icon: 'success'
        }).then(() => {
        });
      } else {
        swal.fire({ text: res.error, icon: 'error' });
      }
    });

  }
  
  goBack() {
    this._location.back();
  }

}
