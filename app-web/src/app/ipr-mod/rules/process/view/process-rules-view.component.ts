import { Component, OnInit } from '@angular/core';
import { LovFetcherService } from 'src/app/common/lov-fetcher/lov-fetcher.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { APP_URL } from 'src/app/common/app-urls/app-urls';
import { ServiceResponse } from 'src/app/common/service-response';
import { MatSnackBar } from '@angular/material/snack-bar';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { TableViewService } from 'src/app/app-widgets/table/table-view/table-view.service';
import { AppLayoutService } from 'src/app/app-layout/app-layout.service';
import { DatePipe, Location } from '@angular/common';
import { RulesService } from '../../rules.service';
import { CommentService } from 'src/app/common/comment/comment.service';
import { format } from 'date-fns';

@Component({
  selector: 'app-process-rules-view',
  templateUrl: './process-rules-view.component.html',
  styleUrls: ['./process-rules-view.component.css']
})
export class ProcessRulesViewComponent implements OnInit {

  rulesObj: any;
  rulesObjCopy: any;
  lovDataObj: object = {};
  selRulesList: Array<any> = [];
  selRulesCopyVal: Array<any> = [];
  hideBreadCrumb: Boolean = false;
  disableForm: Boolean = false;
  hidePublish: Boolean = false;
  publishDate: any;
  comment: string = '';
  is_published: Boolean = false;
  is_admin: boolean = false;
  add_new_rule: boolean = false;

  constructor(
    private _router: Router,
    private _lovService: LovFetcherService,
    private _spinnerService: NgxSpinnerService,
    private _rulesService: RulesService,
    private _tableService: TableViewService,
    private _layoutService: AppLayoutService,
    private _matSnackbar: MatSnackBar,
    private _location: Location,
    private _commService: CommentService
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
    if (this.add_new_rule) {
      this.fecthNewRule();
    }
    else if (this._tableService.selRecord && this._tableService.selRecord['id']) {
      this.fetchEditValue();
    } else {
      this.fetchRules();
    }
  }

  ngOnDestroy(): void {
    this._tableService.selRecord = null;
  }

  private getLovData() {

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

  fetchEditValue() {

    let data = this._tableService.selRecord;
    let _url = environment.baseUrl + APP_URL.FETCH_IPR_RULE;

    let _formData = {
      id: data['id'],
      currentState: data["currentState"],
      itemType: "com.dev.cqr.models.user.Organization"
    };

    this._rulesService.fetchRulePost(_url, _formData).subscribe(res => {

      if (res.status === ServiceResponse.STATUS_SUCCESS) {

        let data = res.response.data;
        this.rulesObj = data;

        if ((this.rulesObj['currentState'] == 'Active' || this.rulesObj['currentState'] == 'InActive') && this.is_admin) {
          this.disableForm = true;
        }

        this.comment = this.rulesObj["remarks"];
        let ruleList = this.rulesObj['rulesCombList'][0]['ruleList'];

        ruleList.forEach(rule => {

          if (rule.iprRulesOpList && rule.iprRulesOpList[0] && rule.iprRulesOpList[0].value) {

            if (rule.ruleDataType.itemValue == "dropdown") {
              this.selRulesList.push(parseInt(rule.iprRulesOpList[0].value));
            } else {
              this.selRulesList.push(rule.iprRulesOpList[0].value);
            }

          } else {
            this.selRulesList.push(null);
          }
        });

        this.selRulesCopyVal = JSON.parse(JSON.stringify(this.selRulesList));
      }

    }, (err) => {
    })

  }

  fecthNewRule() {

    this._spinnerService.show();
    let _url = environment.baseUrl + APP_URL.ADD_NEW_RULE;
    let body = {
      iprRuleType: "process"
    };

    this._rulesService.saveRules(_url, body).subscribe((res) => {

      this._spinnerService.hide();
      if (res.status === ServiceResponse.STATUS_SUCCESS) {

        let data = res.response.data;
        this.rulesObj = data;

        if ((this.rulesObj['currentState'] == 'Active' || this.rulesObj['currentState'] == 'InActive') && this.is_admin) {
          this.disableForm = true;
        }

        let ruleList = this.rulesObj['rulesCombList'][0]['ruleList'];

        ruleList.forEach(rule => {

          if (rule.iprRulesOpList && rule.iprRulesOpList[0] && rule.iprRulesOpList[0].value) {

            if (rule.ruleDataType.itemValue == "dropdown") {
              this.selRulesList.push(parseInt(rule.iprRulesOpList[0].value));
            } else {
              this.selRulesList.push(rule.iprRulesOpList[0].value);
            }

          } else {
            this.selRulesList.push(null);
          }
        });

        this.selRulesCopyVal = JSON.parse(JSON.stringify(this.selRulesList));
      }
    }, (err) => {
      this._spinnerService.hide();
    })
  }

  fetchRules() {

    this._spinnerService.show();
    let _url = environment.baseUrl + APP_URL.BUSINESS_RULES_FETCH;

    let _formData = {};
    _formData['iprRuleType'] = 'process';

    this._rulesService.fetchRules(_url, _formData).subscribe(res => {

      this._spinnerService.hide();
      if (res.status === ServiceResponse.STATUS_SUCCESS) {

        let data = res.response.data;
        this.rulesObj = data;

        if ((this.rulesObj['currentState'] == 'Active' || this.rulesObj['currentState'] == 'InActive') && this.is_admin) {
          this.disableForm = true;
        }

        this.comment = this.rulesObj["remarks"];
        let ruleList = this.rulesObj['rulesCombList'][0]['ruleList'];

        ruleList.forEach(rule => {

          if (rule.iprRulesOpList && rule.iprRulesOpList[0] && rule.iprRulesOpList[0].value) {

            if (rule.ruleDataType.itemValue == "dropdown") {
              this.selRulesList.push(parseInt(rule.iprRulesOpList[0].value));
            } else {
              this.selRulesList.push(rule.iprRulesOpList[0].value);
            }

          } else {
            this.selRulesList.push(null);
          }
        });

        this.selRulesCopyVal = JSON.parse(JSON.stringify(this.selRulesList));
      } else {
        swal.fire({ text: res.error, icon: 'error' });
      }
    });
  }

  validForms() {

    let formValid = false;
    for (let i = 0; i < this.selRulesList.length; i++) {

      if (this.selRulesList[i]) {
        formValid = true;
      } else {
        formValid = false;
        break;
      }
    }
    return formValid;
  }

  markChangeValues() {

    for (let i = 0; i < this.selRulesList.length; i++) {

      if (this.selRulesList[i] != this.selRulesCopyVal[i]) {

        this.rulesObj['rulesCombList'][0].ruleList[i]['iprRulesOpList'][0]['isChange'] = true;
        this.rulesObj['rulesCombList'][0]['isChange'] = true;
        this.rulesObj['rulesCombList'][0].ruleList[i]['isChange'] = true;
      }
    }
  }

  onBeforeRuleSave() {

    let formValid = this.validForms();
    if (!formValid) {
      this._matSnackbar.open("Please filled all values.", "Dismiss", {
        duration: 2000,
      });
      return false;
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

    if (this.is_published == false) {
      this._matSnackbar.open("Please check is published.", "Dismiss", {
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

    this.prepareDataForSaving();
    this._rulesService.fetchRulePost(_url, _formData).subscribe(res => {

      this._spinnerService.hide();
      if (res.status === ServiceResponse.STATUS_SUCCESS) {

        let activeRule = res.response.data;
        let presentActiveRule = activeRule['rulesCombList'][0].ruleList;
        let currentRule = this.rulesObj['rulesCombList'][0].ruleList;
        let ruleCheck = false;

        if (presentActiveRule.length == currentRule.length) {

          for (let i = 0; i < presentActiveRule.length; i++) {

            if (presentActiveRule[i]['iprRulesOpList'][0].value == currentRule[i]['iprRulesOpList'][0].value) {
              ruleCheck = false;
            } else {
              ruleCheck = true;
              break;
            }
          }
        } else {
          ruleCheck = true;
        }

        if (ruleCheck) {

          swal.fire({
            text: "Whether you want to Submit – YES or NO.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
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

  publishRule(comment) {

    this._spinnerService.show();
    this.markChangeValues();
    let url = environment.baseUrl + APP_URL.PUBLISH_RULE;
    this.rulesObj['rulesCombList'][0].isPublishable = this.is_published;
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

          if (this.is_admin) {
            this._router.navigate(['/processrules']);
          }
          else {
            this._router.navigate(['request-dashboard']);
          }
        });
      } else {
        swal.fire({ text: data.error, icon: 'error' });
      }
      this._spinnerService.hide();
    }, (err) => {
      this._spinnerService.hide();
    })
  }

  private prepareDataForSaving() {

    let ruleList = this.rulesObj['rulesCombList'][0]['ruleList'];
    ruleList.forEach((rule: any, idx: number) => {

      rule.iprRulesOpList[0].value = this.selRulesList[idx];
    });
  }

  saveRules() {

    this.prepareDataForSaving();
    this.markChangeValues();
    this._spinnerService.show();
    
    let _url = environment.baseUrl + APP_URL.BUSINESS_SAVE_RULES;

    let reqData=this.rulesObj;

    if(this.is_admin){
    
      _url=environment.baseUrl + APP_URL.BUSINESS_SAVE_RULES_WITH_DATA;
      reqData={"reqData":this.rulesObj,"remarks":this.comment};
    
    }

    this._rulesService.saveRules(_url, reqData).subscribe(res => {

      this._spinnerService.hide();
      if (res.status === ServiceResponse.STATUS_SUCCESS) {

        if (this.add_new_rule) {
          this.rulesObj = JSON.parse(JSON.stringify(res.response));
          this.add_new_rule = false;
        }

        swal.fire({
          text: 'Process rules saved successsfully',
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

  backProcess() {

    if (!this.is_admin) {
      this._router.navigate(['request-dashboard']);
    }
    else {
      this._location.back();
    }
  }

  async updateComment(combList) {
    if (combList && combList.length > 0) {
      let comb = combList[0];

      await this._commService.saveComment({ "itemId": comb["id"], "itemType": comb["itemType"], "remarks": this.comment }).subscribe(res => {

      });

    }
  }
}
