import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProgressStepComponent } from 'src/app/app-widgets/progress-step/progress-step.component';
import { APP_URL } from 'src/app/common/app-urls/app-urls';
import { LovFetcherService } from 'src/app/common/lov-fetcher/lov-fetcher.service';
import { ServiceResponse } from 'src/app/common/service-response';
import { RulesService } from 'src/app/ipr-mod/rules/rules.service';
import { environment } from 'src/environments/environment';
import swal from 'sweetalert2';
import { IprProcessService } from '../../ipr-process.service';

@Component({
  selector: 'app-create-ipr',
  templateUrl: './create-ipr.component.html',
  styleUrls: ['./create-ipr.component.css']
})
export class CreateIprComponent implements OnInit {

  PROCESS_RULE_FIELD_MAP: Object = {
    "iprtype": "iprType", "iprbidtype": "bidType", "iprparticipation": "iprParticipation"
  };


  constructor(private _fb: FormBuilder,
    private _spinnerService: NgxSpinnerService,
    private _lovService: LovFetcherService,
    private _processService: IprProcessService,
    private _router: Router,
    private _location: Location,
    public _dialog: MatDialog,
    private _rulesService: RulesService,) { }

  iprProcess: FormGroup = this._fb.group({
    iprTitle: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(280)]],
    insCategory: ['', [Validators.required]],
    insPlanCategory: ['', [Validators.required]],
    insPlanType: ['', [Validators.required]],
    insPolicyType: ['', [Validators.required]],
    iprType: ['', [Validators.required]],
    bidType: ['', [Validators.required]],
    iprCreationType: [, [Validators.required]],
    iprParticipation: [, []]
  });

  lovDataObj: any;

  ngOnInit(): void {
    this.fetchLovData();
  }

  fetchLovData() {

    this._spinnerService.show();
    let _url = environment.baseUrl + APP_URL.BUSINESS_LOV_IPR_PROCESS;
    this._lovService.getLovList(_url).subscribe(res => {
      if (res.status === ServiceResponse.STATUS_SUCCESS) {

        let data = res.response.data;
        this.lovDataObj = data;

        this.updateDate();

        this.fetchProcessRule();

      } else {
        swal.fire({ text: res.error, icon: 'error' });
      }
    }, error => {
      this._spinnerService.hide();
    });

  }

  updateDate() {
    if (this.lovDataObj) {
      for (let lov of this.lovDataObj?.iprCreationType) {
        if (lov && lov?.itemValue == IprProcessService.CREATE_IPR) {
          this.iprProcess.get("iprCreationType").setValue(lov.id);
          break;
        }
      }
    }
  }

  crateIPR() {

    if (!this.iprProcess.valid) {
      return;
    }

    const dialogRef = this._dialog.open(ProgressStepComponent, {
      width: '40%',
      height: '80%',
      disableClose: true,
      data: {
        stepList: [{ "name": "Create IPR", }, { "name": "RFP Document" },
        { "name": "Process Rule" }, { "name": "Calendar Rules (RFP)" },
        { "name": "Qualification Criteria" }, { "name": "Evaluation Criteria" }]
      }
    });

    let _url = environment.baseUrl + APP_URL.BUSINESS_SAVE_IPR_PROCESS;
    let data = { "reqData": this.iprProcess.value };

    this._processService.saveIPRProcess(_url, data).subscribe(res => {
      dialogRef.close();
      if (res.status === ServiceResponse.STATUS_SUCCESS) {
        swal.fire({
          text: 'Created IPR Success fully',
          icon: 'success'
        }).then(() => {

          this._router.navigate(['/ipr/list']);
        });
      } else {
        swal.fire({ text: res.error, icon: 'error' });
      }
    }, error => {
      dialogRef.close();
      swal.fire({ text: "Something went wrong while creating IPR Process. Please try again.", icon: 'error' });
    });
  }

  backProcess() {
    this._location.back();
  }

  fetchProcessRule() {

    this._spinnerService.show();
    let _url = environment.baseUrl + APP_URL.BUSINESS_RULES_FETCH;

    let _formData = {};
    _formData['iprRuleType'] = 'process';
    this._rulesService.fetchRules(_url, _formData).subscribe(res => {
      this._spinnerService.hide();
      if (res.status === ServiceResponse.STATUS_SUCCESS) {
        let data = res.response.data;

        let ruleList = data['rulesCombList'][0]['ruleList'];

        ruleList.forEach(rule => {

          if (rule && rule.iprRulesOpList && rule.iprRulesOpList[0]) {
            if (this.PROCESS_RULE_FIELD_MAP.hasOwnProperty(rule["ruleItemName"])) {
              let value = rule.iprRulesOpList[0].value;

              if (!isNaN(Number(rule.iprRulesOpList[0].value))) {
                value = Number(rule.iprRulesOpList[0].value)
              }


              this.iprProcess.get(this.PROCESS_RULE_FIELD_MAP[rule["ruleItemName"]]).setValue(value);
            }
          }

        });

        this._spinnerService.hide();

      } else {
        swal.fire({ text: res.error, icon: 'error' });
        this._spinnerService.hide();
      }
    }, error => {
      swal.fire({ text: "Error while fetching process rule", icon: 'error' });
      this._spinnerService.hide();
    });
  }
}
