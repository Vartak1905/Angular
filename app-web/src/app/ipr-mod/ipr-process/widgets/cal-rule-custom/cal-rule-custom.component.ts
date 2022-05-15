import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { RulesService } from 'src/app/ipr-mod/rules/rules.service';
import { environment } from 'src/environments/environment';
import { APP_URL } from 'src/app/common/app-urls/app-urls';
import swal from 'sweetalert2';
import { ServiceResponse } from 'src/app/common/service-response';
import { MatRadioButton } from '@angular/material/radio';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IprProcessService } from '../../ipr-process.service';
import { DateAdapter, MatDateFormats, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';

export class AppDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === "input") {
      let day: string = date.getDate().toString();
      day = +day < 10 ? "0" + day : day;
      let month: string = (date.getMonth() + 1).toString();
      month = +month < 10 ? "0" + month : month;
      let year = date.getFullYear();
      return `${day}-${month}-${year}`;
    }
    return date.toDateString();
  }
}
export const APP_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: { month: "short", year: "numeric", day: "numeric" },
  },
  display: {
    dateInput: "input",
    monthYearLabel: { year: "numeric", month: "numeric" },
    dateA11yLabel: { year: "numeric", month: "long", day: "numeric"
    },
    monthYearA11yLabel: { year: "numeric", month: "long" },
  }
};

@Component({
  selector: 'app-cal-rule-custom',
  templateUrl: './cal-rule-custom.component.html',
  styleUrls: ['./cal-rule-custom.component.css'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})
export class CalRuleCustomComponent implements OnInit {

  Toast = swal.mixin({
    toast: true,
    position: 'bottom',
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
  });

  standCalRules: any;
  customCalRules: any;
  calendarRules: any;

  calendarTypeList = ["Standard", "Custom"];

  @Input() itemId: number;
  @Input() uniqueRef: string;
  @Input() itemType: string;
  @Input() issueDate: Date;
  @Input() calendarType: string;
  @Input() isSave: boolean = false;
  @Input() showCalTypes: boolean = false;

  @Output() onDataChange = new EventEmitter();

  standIssueDate: Date;
  customIssueDate: Date;
  standEndDate: Date;
  customEndDate: Date;

  calendarDetails: FormGroup = this._fb.group({
    calendarType: [, [Validators.required]],
    startDate: ['', [Validators.required]],
    endDate: ['', [Validators.required]],
  });

  constructor(
    private _spinnerService: NgxSpinnerService,
    private _rulesService: RulesService,
    private _fb: FormBuilder,
    private _processService: IprProcessService,
    private _changeDetRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.calendarDetails.get("startDate").setValue(this.issueDate);
    this.fetchCalendarRule();
  }

  fetchCalendarRule() {

    if (!this.itemId || !this.itemType) {
      swal.fire({ icon: "error", title: "Invalid request data for fetching calendar rule" });
      return;
    }

    let _url = environment.baseUrl + APP_URL.FETCH_IPR_RULE;
    let _formData = {
      itemId: this.itemId,
      currentState: 'Active',
      itemType: this.itemType,
      iprRuleType: "calendar-rfp"
    };

    this._spinnerService.show();

    this._rulesService.fetchRulePost(_url, _formData).subscribe(res => {

      this._spinnerService.hide();
      if (res.status === ServiceResponse.STATUS_SUCCESS) {
        let data = res.response.data;
        this.calendarRules = data;
        this.standCalRules = data;
        this.customCalRules = data;

        this.calendarDetails.get("calendarType").setValue(this.calendarType);
        this.calendarRules = JSON.parse(JSON.stringify(data));

        this.updateCalDate();

      }

    }, (err) => {
      this._spinnerService.hide();
    })
  }

  updateCalData() {

    if (this.calendarType == "Standard") {

      if (this.calendarRules) {
        this.customCalRules = JSON.parse(JSON.stringify(this.calendarRules));
      }
      this.calendarRules = JSON.parse(JSON.stringify(this.standCalRules));
      if (this.standIssueDate) {
        this.issueDate = new Date(this.standIssueDate);
        this.calendarDetails.get("startDate").setValue(this.standIssueDate);
        this.calendarDetails.get("endDate").setValue(this.standEndDate);
      } else {
        this.issueDate = null;
        this.calendarDetails.get("startDate").setValue(null);
        this.calendarDetails.get("endDate").setValue(null);
      }
    }

    if (this.calendarType == "Custom") {

      if (this.calendarRules) {
        this.standCalRules = JSON.parse(JSON.stringify(this.calendarRules));
      }
      this.calendarRules = JSON.parse(JSON.stringify(this.customCalRules));
      if (this.customIssueDate) {
        this.issueDate = new Date(this.customIssueDate);
        this.calendarDetails.get("startDate").setValue(this.customIssueDate);
        this.calendarDetails.get("endDate").setValue(this.customEndDate);
      } else {
        this.issueDate = null;
        this.calendarDetails.get("startDate").setValue(null);
        this.calendarDetails.get("endDate").setValue(null);
      }
    }

    this.emitCalData();
  }

  updateCalDate() {
    if (this.issueDate) {

      this.issueDate = new Date(this.issueDate);

      let todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);

      if (this.issueDate < todayDate) {

        this._changeDetRef.detectChanges();

        this.Toast.fire({ icon: 'error', title: 'Issue date cannot be less than todays date' });

        this.issueDate = null;

        if (this.calendarType == "Standard") {
          this.standIssueDate = null;
          this.standEndDate = null;
        }

        if (this.calendarType == "Custom") {
          this.customIssueDate = null;
          this.customEndDate = null;
        }

        this.calendarDetails.get("startDate").setValue(null);
        this.calendarDetails.get("endDate").setValue(null);
        this.emitCalData();
      }
      else {

        this.calendarDetails.get("startDate").setValue(this.issueDate);
        let ruleDate;

        for (let rule of this.calendarRules?.rulesCombList[0]['ruleList']) {

          if (rule["name"] == "Issue Date") {
            continue;
          }

          if (rule?.iprRulesOpList[0].value) {

            rule.iprRulesOpList[0].iprDate = new Date(this.issueDate.getTime());
            rule.iprRulesOpList[0].iprDate.setDate(rule.iprRulesOpList[0].iprDate.getDate() + new Number(rule?.iprRulesOpList[0].value));
            ruleDate = rule.iprRulesOpList[0].iprDate;
          }
        }

        if (this.calendarType == "Standard") {
          this.standIssueDate = new Date(this.issueDate);
          this.standEndDate = new Date(ruleDate);
        }

        if (this.calendarType == "Custom") {
          this.customIssueDate = new Date(this.issueDate);
          this.customEndDate = new Date(ruleDate);
        }

        this.calendarDetails.get("endDate").setValue(ruleDate);
        this.emitCalData();
      }
    }
  }

  calTypeChange($event: MatRadioButton) {

    this.calendarType = $event["value"];
    this.calendarDetails.get("calendarType").setValue(this.calendarType);
    this.updateCalData();
  }

  emitCalData() {

    if (this.onDataChange) {
      let calData = { "calDetails": this.calendarDetails.value, "calRules": this.calendarRules };
      this.onDataChange.emit(calData)
    }
  }

  isValidCalendarRules() {

    if (!this.calendarDetails.get("calendarType").valid) {
      return { valid: false, message: "Please select calendar type" };
    }
    if (!this.calendarDetails.get("startDate").valid) {
      return { valid: false, message: "Please select issue date" };
    }
    
    let todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    if (this.calendarDetails.get("startDate").value < todayDate) {
      return { valid: false, message: "Issue date cannot be less than todays date" };
    }
    return this._rulesService.isValidCalRules(this.calendarRules);
  }

  saveCalRule() {

    let validData = this.isValidCalendarRules();

    if (!validData["valid"]) {
      this.Toast.fire({
        icon: 'error',
        title: validData?.message
      })

      return;
    }

    this._spinnerService.show();
    let _url = environment.baseUrl + APP_URL.BUSINESS_SAVE_RULES;

    this._rulesService.saveRules(_url, this.calendarRules).subscribe((res) => {

      if (res.status === ServiceResponse.STATUS_SUCCESS) {
        this.fetchAndUpdtIPRPRocess();
      } else {
        swal.fire({ text: res.error, icon: 'error' });
      }

    }, (err) => {
      swal.fire({ text: "Something went wrong while saving Calendar Rules. Please try again.", icon: 'error' });
    });
  }

  fetchAndUpdtIPRPRocess() {

    if (!this.itemId || !this.uniqueRef) {
      swal.fire({ icon: "error", title: "Invalid request data for fetching IPR Process" });
      return;
    }

    let _url = environment.baseUrl + APP_URL.BUSINESS_LOV_FETCH_IPR_PROCESS;
    let paramObj = { "id": this.itemId, "uniqueRef": this.uniqueRef };
    this._spinnerService.show();

    this._processService.fecthIPRProcess(_url, JSON.stringify(paramObj)).subscribe(res => {

      this._spinnerService.hide();
      if (res.status === ServiceResponse.STATUS_SUCCESS) {

        if (!res.response.data) {
          swal.fire("IPR Process not found.", 'failure');
          this._spinnerService.hide();
          return;
        } else {
          Object.assign(res.response.data, this.calendarDetails.value);
          this.saveIPRProcess(res.response.data);
        }
      } else {
        swal.fire(res.response.error, 'failure');
        this._spinnerService.hide();
      }
    }, (err) => {
      this._spinnerService.hide();
    });
  }

  saveIPRProcess(processData) {

    this._spinnerService.show();
    let _url = environment.baseUrl + APP_URL.BUSINESS_SAVE_IPR_PROCESS;
    let data = { "reqData": processData };

    this._processService.saveIPRProcess(_url, data).subscribe(res => {

      this._spinnerService.hide();
      if (res.status === ServiceResponse.STATUS_SUCCESS) {

        this.Toast.fire({
          icon: 'success',
          title: 'Successully saved IPR Process'
        });
      } else {
        swal.fire({ text: res.error, icon: 'error' });
      }
    }, error => {
      swal.fire({ text: "Something went wrong while saving IPR Process. Please try again.", icon: 'error' });
    });
  }
}
