import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppLayoutService } from 'src/app/app-layout/app-layout.service';
import { TableViewService } from 'src/app/app-widgets/table/table-view/table-view.service';
import { APP_URL } from 'src/app/common/app-urls/app-urls';
import { LovFetcherService } from 'src/app/common/lov-fetcher/lov-fetcher.service';
import { environment } from 'src/environments/environment';
import { RulesService } from '../../rules.service';
import { ServiceResponse } from 'src/app/common/service-response';
import { DatePipe, Location } from '@angular/common';
import swal from 'sweetalert2';
import { format } from 'date-fns';

@Component({
  selector: 'app-eval-criteria-view',
  templateUrl: './eval-criteria-view.component.html',
  styleUrls: ['./eval-criteria-view.component.css']
})
export class EvalCriteriaViewComponent implements OnInit {

  rulesObj: any;
  rulesObjCopy: any;
  lovDataObj: any = {};
  selRulesList: Array<any> = [];
  hideBreadCrumb: Boolean = false;
  disableForm: Boolean = false;
  hidePublish: Boolean = false;
  publishDate: any;
  comment: string = '';
  is_published: Boolean = false;
  is_admin: boolean = false;
  category_id: any;
  plan_category_id: any;
  combination_rules: any = [];
  insurance_category: object = {};
  insurance_plan_category: object = {};
  selected_combinations: any;
  show_inputs: boolean = false;
  show_table: boolean = false;
  headerList = [];
  operators_list = [];
  indexObj: object = {};
  colSpan: object = {};
  arithmetic_list = [];
  scores_obj = {};
  weight_sum: number = 0;
  weight_id: any = null;
  selectCombIndex: number = null;
  selInsCategory: string = null;
  selInsPlanCategory: string = null;
  combination_data = [];
  add_new_rule: boolean = false;

  Toast = swal.mixin({
    toast: true,
    position: 'bottom',
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
  });

  constructor(
    private _router: Router,
    private _lovService: LovFetcherService,
    private _spinnerService: NgxSpinnerService,
    private _rulesService: RulesService,
    private _tableService: TableViewService,
    private _layoutService: AppLayoutService,
    private _matSnackbar: MatSnackBar,
    private _location: Location,
  ) {
    let navData = this._router.getCurrentNavigation();
    if (navData && navData.extras && navData.extras.state && navData.extras.state.add_new_rule) {
      this.add_new_rule = navData.extras.state.add_new_rule;
    }
  }

  ngOnInit(): void {

    let roleList = this._layoutService.user && this._layoutService.user['roleList'] ? this._layoutService.user['roleList'] : [];
    if (roleList) {
      let index = roleList.findIndex(item => item.name == "CQRWorld Admin");
      if (index != -1) {
        this.hidePublish = true;
        this.is_admin = true;
      }
    }

    this.publishDate = format(new Date(), 'dd/MM/yyyy');
    this.getLovData();
  }

  ngOnDestroy(): void {
    this._tableService.selRecord = null;
  }

  sortData() {

    this.arithmetic_list = this.rulesObj['rulesCombList'][0]['ruleList'][0]['iprRulesOpList'];
    this.arithmetic_list = this.arithmetic_list.sort((e1, e2) => e1.position > e2.position ? 1 : -1);

    this.rulesObj['rulesCombList'].forEach(element => {
      element['ruleList'].forEach(optList => {
        optList['iprRulesOpList'] = optList['iprRulesOpList'].sort((e1, e2) => e1.position > e2.position ? 1 : -1);
      });
    })

    this.rulesObjCopy = JSON.parse(JSON.stringify(this.rulesObj));
  }

  private getLovData() {

    this._spinnerService.show();
    let _url = environment.baseUrl + APP_URL.BUSINESS_LOV_PROCESS_RULES;

    this._lovService.getLovList(_url).subscribe(res => {

      this._spinnerService.hide();
      if (this.add_new_rule) {
        this.fecthNewRule();
      } else if (this._tableService.selRecord && this._tableService.selRecord['id']) {
        this.fetchEditRules();
      } else {
        this.fetchRules();
      }
      if (res.status === ServiceResponse.STATUS_SUCCESS) {

        let data = res.response.data;
        this.lovDataObj = data;
        this.category_id = this.lovDataObj['insuranceCategory']['id'];
        this.plan_category_id = this.lovDataObj['insurancePlanCategory']['id'];

        this.lovDataObj['insuranceCategory']['data'].forEach(element => {
          this.insurance_category[element.id] = element.itemName;
        });

        this.lovDataObj['insurancePlanCategory']['data'].forEach(element => {
          this.insurance_plan_category[element.id] = element.itemName;
        });

        this.lovDataObj["scores"] = this.lovDataObj["scores"].sort((e1, e2) => e1.itemPosition > e2.itemPosition ? 1 : -1);

        this.lovDataObj["scores"].forEach(element => {

          if (element.itemValue == 'weight') {
            this.weight_id = element.id;
          }
          this.scores_obj[element.id] = { value: element.itemValue, label: element.itemName };
        });

      } else {
        swal.fire({ text: res.error, icon: 'error' });
      }
    });
  }

  fecthNewRule() {

    this._spinnerService.show();
    let _url = environment.baseUrl + APP_URL.ADD_NEW_RULE;
    let body = {
      iprRuleType: "eval-criteria"
    };

    this._rulesService.saveRules(_url, body).subscribe((res) => {

      this._spinnerService.hide();
      if (res.status === ServiceResponse.STATUS_SUCCESS) {

        let data = res.response.data;
        this.rulesObj = JSON.parse(JSON.stringify(data));
        this.sortData();
        this.makeOperators();
        this.updateDataByComb();
        if ((this.rulesObj['currentState'] == 'Active' || this.rulesObj['currentState'] == 'InActive') && this.is_admin) {
          this.disableForm = true;
        }
      } else {
        swal.fire({ text: res.error, icon: 'error' });
      }
    }, (err) => {
      this._spinnerService.hide();
    })
  }

  fetchRules() {

    this._spinnerService.show();
    let _url = environment.baseUrl + APP_URL.BUSINESS_RULES_FETCH;

    let _formData = {};
    _formData['iprRuleType'] = 'eval-criteria';

    this._rulesService.fetchRules(_url, _formData).subscribe(res => {

      this._spinnerService.hide();
      if (res.status === ServiceResponse.STATUS_SUCCESS) {

        let data = res.response.data;
        this.rulesObj = JSON.parse(JSON.stringify(data));
        this.sortData();
        this.makeOperators();
        this.updateDataByComb();

        if ((this.rulesObj['currentState'] == 'Active' || this.rulesObj['currentState'] == 'InActive') && this.is_admin) {
          this.disableForm = true;
        }
      } else {
        swal.fire({ text: res.error, icon: 'error' });
      }
    });
  }

  validForms() {

    let formValid = false;
    let message = '';
    if (this.weight_sum == 100) {
      formValid = true;
    } else {
      message = 'Total weight must be equal to 100';
      formValid = false;
    }

    if (formValid) {
      let combId = 1;
      while (combId < this.combination_rules.length) {

        let combData = this.combination_data[combId - 1];
        let combInsCat = combData?.category_name;
        let combInsPlanCat = combData?.plan_category_name;


        for (let i = 0; i < this.combination_rules[combId]['ruleList'].length; i++) {

          // if (this.combination_rules[this.selectCombIndex]['ruleList'][i]['isRule'] == false && this.combination_rules[this.selectCombIndex]['ruleList'][i]['isMultiple']) {
          //   continue;
          // }

          let ruleName = this.combination_rules[combId]['ruleList'][i]?.ruleName;
          let isMandatoryAllOp = this.combination_rules[combId]['ruleList'][i]?.isMandatoryAllOp;

          let errMsg = " in '" + ruleName + "' of " + combInsCat + " - " + combInsPlanCat;

          let isEmptyVal = false;
          let definedValue = null;

          for (let j = 0; j < this.combination_rules[combId]['ruleList'][i]['iprRulesOpList'].length; j++) {

            let opValue = this.combination_rules[combId]['ruleList'][i]['iprRulesOpList'][j]['value'];

            if (opValue) {

              let valuePatternStr = this.combination_rules[combId]['ruleList'][i]['iprRulesOpList'][j]["valuePattern"];

              let pattern;
              let patternMsg;
              let patternFlags;

              try {

                let valuePattern = JSON.parse(valuePatternStr);
                pattern = valuePattern?.exp;
                patternMsg = valuePattern?.msg;
                patternFlags = valuePattern?.flags;

              } catch (e) { }




              let valueType = this.combination_rules[combId]['ruleList'][i]['iprRulesOpList'][j]['ruleDataType']['itemValue'];

              if (valueType == 'number') {
                formValid = !isNaN(opValue);

                if (formValid) {

                  let isValidVal = this.isValidValue(opValue, pattern, patternFlags);

                  if (!isValidVal) {
                    message = patternMsg + errMsg;
                    formValid = false;
                    break;
                  } else {
                    definedValue = opValue;
                  }
                }

                message = formValid ? message = '' : message = 'Please enter number';
                break;

              } else if (valueType == "text") {
                let isValidVal = this.isValidValue(opValue, pattern, patternFlags);

                if (!isValidVal) {
                  message = patternMsg + errMsg;
                  formValid = false;
                  break;
                }
                definedValue = opValue;
                formValid = true;
              }
              else {
                definedValue = opValue;
                formValid = true;
              }
            } else {
              isEmptyVal = true;
              message = 'Please fill all values';
              if (isMandatoryAllOp == false) {
                formValid = false;
                continue;
              }
              formValid = false;
              break;
            }
          }

          if (!formValid && isEmptyVal && isMandatoryAllOp == false && definedValue != null) {
            formValid = true;
            continue;
          }
          if (!formValid) {
            break;
          }
        }

        if (!formValid) {
          return { valid: formValid, message };
        }

        combId++;

      }
    }

    return { valid: formValid, message };
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

  checkValues(item, index, subindex) {

    if (item.label != this.weight_id && this.arithmetic_list[subindex] && this.arithmetic_list[subindex]['arithOperator']) {
      if (this.combination_rules[this.selectCombIndex]['ruleList'][index]['iprRulesOpList'][subindex - 1]['label'] != this.weight_id) {
        let operator = this.arithmetic_list[subindex]['arithOperator'];
        let valueValid = this.validValues(item.value, this.combination_rules[this.selectCombIndex]['ruleList'][index]['iprRulesOpList'][subindex - 1]['value'], operator);
      }
    }
  }

  fetchEditRules() {

    this._spinnerService.show();
    let data = this._tableService.selRecord;
    let _url = environment.baseUrl + APP_URL.FETCH_IPR_RULE;
    let _formData = {
      id: data['id'],
      currentState: data["currentState"],
      itemType: "com.dev.cqr.models.user.Organization"
    };

    this._rulesService.fetchRulePost(_url, _formData).subscribe(res => {

      this._spinnerService.hide();
      if (res.status === ServiceResponse.STATUS_SUCCESS) {

        let data = res.response.data;
        this.comment = res.response.remarks;
        this.rulesObj = JSON.parse(JSON.stringify(data));
        this.rulesObjCopy = JSON.parse(JSON.stringify(data));
        this.sortData();
        this.makeOperators();
        this.updateDataByComb();

        if ((this.rulesObj['currentState'] == 'Active' || this.rulesObj['currentState'] == 'InActive') && this.is_admin) {
          this.disableForm = true;
        }
      }
    }, (err) => {
      this._spinnerService.hide();
    })
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

  handleMenu = (row) => {

    this._tableService.selRecord = row;
    for (let i = 0; i < this.combination_rules.length; i++) {

      if (this.combination_rules[i]["field1Value"] == this._tableService.selRecord["field1Value"] && this.combination_rules[i]["field2Value"] == this._tableService.selRecord["field2Value"]) {

        this.selectCombIndex = i;
        this.show_inputs = true;
        this.selInsCategory = this._tableService.selRecord["category_name"];
        this.selInsPlanCategory = this._tableService.selRecord["plan_category_name"];
        break;
      }
    }

    this.calculateWeight();
  }

  emitTableData(_data: Array<Object>, _config: Object) {

    let data = new Object();
    data['data'] = _data.slice();
    data['config'] = _config;
    this._tableService.emitTableData(data);
  }

  onBeforeRuleSave() {

    if (this.combination_rules[this.selectCombIndex]['isPublishable']) {
      let validation = this.validForms();
      if (!validation.valid) {
        this._matSnackbar.open(validation.message, "Dismiss", {
          duration: 5000,
        });
        return false;
      }
    }

    if (this.add_new_rule) {

      swal.fire({
        title: 'Are you sure?',
        text: "On clicking yes, new system rules will be added and you won't be able to revert",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Add',
        cancelButtonText: "Cancel"
      }).then((result) => {
        if (result.isConfirmed) {
          this.saveRules();
        }
      });
    } else {
      this.saveRules();
    }
  }

  onBeforePublished() {

    let validation = this.validForms();

    if (!validation.valid) {
      this._matSnackbar.open(validation.message, "Dismiss", {
        duration: 2000,
      });
      return false;
    }

    if (!this.comment) {
      this._matSnackbar.open("Please enter comment.", "Dismiss", {
        duration: 2000,
      });
      return false;
    }

    this._spinnerService.show();
    let _url = environment.baseUrl + APP_URL.FETCH_IPR_RULE;
    let _formData = {
      ruleType: this.rulesObj.ruleType,
      itemId: this.rulesObj.itemId,
      currentState: 'Active',
      itemType: this.rulesObj.itemType
    };

    this._rulesService.fetchRulePost(_url, _formData).subscribe(res => {

      this._spinnerService.hide();
      if (res.status === ServiceResponse.STATUS_SUCCESS) {

        let activeRule = res.response.data;
        let presentActiveRule = activeRule['rulesCombList'];
        let currentRule = this.combination_rules;
        let ruleCheck = false;

        for (let i = 0; i < presentActiveRule.length; i++) {
          for (let j = 0; j < presentActiveRule[i]['ruleList'].length; j++) {
            for (let k = 0; k < presentActiveRule[i]['ruleList'][j]['iprRulesOpList'].length; k++) {

              if (presentActiveRule[i]['ruleList'][j]['iprRulesOpList'][k]['value'] == currentRule[i]['ruleList'][j]['iprRulesOpList'][k]['value']) {
                ruleCheck = false;
              } else {
                ruleCheck = true;
                break;
              }
            }
            if (ruleCheck)
              break;
          }
          if (ruleCheck)
            break;
        }

        if (ruleCheck) {
          swal.fire({
            text: "Whether you want to Submit – YES or NO.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            cancelButtonText: "No"

          }).then((result) => {
            if (result.isConfirmed) {
              this.publishRule(this.comment);
            }
          });
        } else {
          this._matSnackbar.open("Previous rules have same values.", "Dismiss", {
            duration: 2000,
          });
        }

      } else {
        swal.fire({ text: res.error, icon: 'error' });
      }
    });
  }

  markChangeValues() {

    this.rulesObj['rulesCombList'].forEach((combination, i) => {

      let ruleCount = 0;
      combination['ruleList'].forEach((rules, j) => {
        let iprCount = 0;

        rules['iprRulesOpList'].forEach((opr, k) => {
          if (opr.value != this.rulesObjCopy['rulesCombList'][i]['ruleList'][j]['iprRulesOpList'][k]['value']) {
            opr['isChange'] = true;
            iprCount += 1;
          }
        });
        if (iprCount > 0) {
          rules['isChange'] = true;
          ruleCount += 1;
        }
      });
      if (ruleCount > 0) {
        combination['isChange'] = true;
      }
    });
  }

  saveRules() {

    let validation = this.validForms();

    if (!validation.valid) {
      this._matSnackbar.open(validation.message, "Dismiss", {
        duration: 2000,
      });
      return false;
    }

    this.rulesObj["rulesCombList"] = this.combination_rules;
    this.markChangeValues();
    this._spinnerService.show();
    let _url = environment.baseUrl + APP_URL.BUSINESS_SAVE_RULES;

    let reqData = this.rulesObj;

    if (this.is_admin) {

      _url = environment.baseUrl + APP_URL.BUSINESS_SAVE_RULES_WITH_DATA;
      reqData = { "reqData": this.rulesObj, "remarks": this.comment };

    }

    this._rulesService.saveRules(_url, reqData).subscribe(res => {

      this._spinnerService.hide();
      if (res.status === ServiceResponse.STATUS_SUCCESS) {

        if (this.add_new_rule) {
          this.rulesObj = JSON.parse(JSON.stringify(res.response));
          this.add_new_rule = false;
        }

        swal.fire({
          text: 'Evaluation Criteria rules saved successsfully',
          icon: 'success'
        }).then(() => {

          if (!this.is_admin) {
            this._router.navigate(['request-dashboard']);
          }
        });

      } else {
        swal.fire({ text: res.error, icon: 'error' });
      }
    });
  }

  onPublishChange($event = null) {

    if ($event && this.combination_rules[this.selectCombIndex]) {
      this.combination_rules[this.selectCombIndex]['isPublishable'] = $event["checked"];
    }

    for (let combTableRow of this.combination_data) {
      if (this.combination_rules[this.selectCombIndex]["field1Value"] == combTableRow["field1Value"] && this.combination_rules[this.selectCombIndex]["field2Value"] == combTableRow["field2Value"]) {
        combTableRow["published"] = (this.combination_rules[this.selectCombIndex]['isPublishable']) == true ? "Yes" : "No";
        break;
      }
    }

    let publishCount = this.combination_rules.filter(
      item => item["isPublishable"] == true
    ).length;
    if (this.combination_rules.length > 0 && publishCount == this.combination_rules.length - 1) {
      this.is_published = true;
    } else {
      this.is_published = false;
    }
  }

  validValues(val1, val2, operator) {

    if (val1 && val2 && operator) {
      if (operator == "=") {
        return true;
      } else {
        switch (operator) {
          case "<":
            return val2 < val1;
          case ">":
            return val2 < val1;
          case "<=":
            return val2 <= val1;
          case "<=":
            return val2 <= val1;
          case ">=":
            return val2 >= val1;
          default:
            return true;
        }
      }
    } else {
      return true;
    }
  }

  publishRule(comment) {

    this.rulesObj["rulesCombList"] = JSON.parse(JSON.stringify(this.combination_rules));
    this.markChangeValues();
    this._spinnerService.show();
    let url = environment.baseUrl + APP_URL.PUBLISH_RULE;

    let postObj = {
      isPublish: true,
      remarks: comment,
      reqData: this.rulesObj
    };

    this._rulesService.saveRules(url, postObj).subscribe((data) => {

      if (data.status === ServiceResponse.STATUS_SUCCESS) {

        if (this.add_new_rule) {
          this.rulesObj = JSON.parse(JSON.stringify(data.response));
          this.add_new_rule = false;
        }

        swal.fire({
          text: 'Rules Published Successfully.',
          icon: 'success'
        }).then(() => {
          if (this.is_admin)
            this._router.navigate(['/evalcriterias']);
        });
      } else {
        swal.fire({ text: data.error, icon: 'error' });
      }

      this._spinnerService.hide();

    }, (err) => {
      this._spinnerService.hide();
    })
  }

  getTableData(combList) {

    if (combList) {

      this.category_id = this.lovDataObj['insuranceCategory']['id'];
      this.plan_category_id = this.lovDataObj['insurancePlanCategory']['id'];

      let catMap = this.getLovItemMap(this.lovDataObj['insuranceCategory']["data"]);
      let planCatMap = this.getLovItemMap(this.lovDataObj['insurancePlanCategory']["data"]);
      let tableData = [];

      for (let comb of combList) {
        if (!catMap.get(comb["field1Value"]) || !planCatMap.get(comb["field2Value"])) {
          continue;
        }

        let row = {
          "category_name": catMap.get(comb["field1Value"]),
          "plan_category_name": planCatMap.get(comb["field2Value"]),
          "published": comb["isPublishable"] == true ? "Yes" : "No",
          "field1Value": comb["field1Value"],
          "field2Value": comb["field2Value"],
          "isChange": comb['isChange']
        };

        tableData.push(row);
      }

      return tableData;
    }
    else {
      return [];
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

  getLovItemMap(lovItems) {

    if (lovItems) {
      let itemMap = new Map();
      for (let item of lovItems) {
        itemMap.set(item["id"], item["itemName"]);
      }
      return itemMap;
    } else {
      return new Map();
    }
  }

  createTable() {

    this.combination_data = this.getTableData(this.rulesObj['rulesCombList']);

    if (this.combination_data.length > -1) {
      this._tableService.selRecord = this.combination_data[0];
      this.handleMenu(this._tableService.selRecord);
      this.calculateWeight();
    }
  }

  updateDataByComb() {

    if (this.rulesObj['rulesCombList']) {
      this.combination_rules = JSON.parse(JSON.stringify(this.rulesObj['rulesCombList']));
      this.comment = this.rulesObj["remarks"];
      if (this.combination_rules.length > 0) {
        this.selectCombIndex = 0;
        this.show_inputs = true;
        this.onPublishChange();
      }
      this.createTable();
    }
  }

  backProcess() {

    if (!this.is_admin) {
      this._router.navigate(['request-dashboard']);
    }
    else {
      this._location.back();
    }
  }

  isValidValue(opValue, pattern, patternFlags) {
    
    if (!opValue) {
      return false;
    }
    if (pattern) {
      let re = new RegExp(pattern);
      if (patternFlags) {
        re = new RegExp(pattern, patternFlags);
      }

      if (!re.test(String(opValue))) {
        return false;;
      }
      return true;
    }

    return true;
  }
}
