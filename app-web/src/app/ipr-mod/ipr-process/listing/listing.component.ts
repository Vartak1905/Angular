import { Component, OnInit } from '@angular/core';
import { RulesService } from '../../rules/rules.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ServiceResponse } from 'src/app/common/service-response';
import { environment } from 'src/environments/environment';
import { APP_URL } from 'src/app/common/app-urls/app-urls';
import swal from 'sweetalert2';
import { LovFetcherService } from 'src/app/common/lov-fetcher/lov-fetcher.service';
import { IprProcessService } from '../ipr-process.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FilterComponent } from './filter/filter.component';
import { DatePipe } from '@angular/common';
import { ProgressStepComponent } from 'src/app/app-widgets/progress-step/progress-step.component';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent implements OnInit {

  REQUEST_DATE_FORMAT: string = "dd-MM-yyyy";

  Toast = swal.mixin({
    toast: true,
    position: 'bottom',
    showConfirmButton: false,
    timer: 5000
  });

  lovDataObj: any;
  iprCreationTypeIcon = { "quickIPR": "flash_on", "createIPR": "add" };
  pageSize: number = 5;
  pageNumber: number = 1;
  isLoadingData: boolean = false;
  showNoRecMsg: boolean = false;
  filterCondArr: Array<object> = [];

  iprList: Array<Object> = [];
  iprProcessType: string;

  toast = swal.mixin({
    toast: true,
    position: 'bottom',
    timer: 5000
  });

  constructor(
    private _spinnerService: NgxSpinnerService,
    private _lovService: LovFetcherService,
    private _rulesService: RulesService,
    private _processService: IprProcessService,
    private _router: Router,
    private _dialog: MatDialog,
    private _datepipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.fetchLovData();
    this.fetchIPRListing();
  }

  private fetchIPRListing(): void {

    if (!this.isLoadingData) {
      this._spinnerService.show();
    }

    let _url = environment.baseUrl + APP_URL.BUSINESS_IPR_PROCESS_LISTING;

    let _formData = {};
    _formData['pageNumber'] = this.pageNumber;
    _formData['pageSize'] = this.pageSize;
    _formData['filterData'] = this.filterCondArr;

    this._rulesService.fetchIPRLIsting(_url, _formData).subscribe(res => {

      this._spinnerService.hide();
      this.isLoadingData = false;

      if (res.status === ServiceResponse.STATUS_SUCCESS) {

        let data = res.response.data;

        if (data.length > 0) {
          if (this.pageNumber == 1) {
            this.iprList = data;
          } else {
            this.iprList = this.iprList.concat(data);
          }

          this.iprProcessType = res.response?.itemType;
          this.prepareListingData(res.response['processStages']);
        }
        else {
          this.showNoRecMsg = true;
        }

      } else {
        swal.fire({ text: res.error, icon: 'error' });
      }
    });
  }

  private prepareListingData(stages: Array<object>): void {

    stages.sort((a, b) => {

      let comparison = 0;
      if (a['stagePosition'] > b['stagePosition']) {
        comparison = 1;
      } else if (a['stagePosition'] < b['stagePosition']) {
        comparison = -1;
      }

      return comparison;
    });

    this.iprList.forEach(ipr => {

      if (ipr['iprCreationType']['itemValue'] == 'createIPR' && ipr['iprStatus'] == 'Yet to issue') {

        let newStages = JSON.parse(JSON.stringify(stages));
        let isCurrStageFound = false;

        newStages.forEach(stage => {

          if (!isCurrStageFound) {

            if (stage['id'] == ipr['procStageRef']) {
              isCurrStageFound = true;
            }

            stage['isActive'] = true;
          }
        });

        ipr['processStages'] = newStages;
      }
    });
  }

  redirectToRules(cstage, ipr) {
    let state_obj = {
      insurance_cat: ipr?.insCategory?.id,
      insurance_plan_cat: ipr?.insPlanType?.id,
      insurance_cat_sel: ipr?.insCategory?.itemName,
      insurance_plan_cat_sel: ipr?.insPlanType?.itemName
    }
    if (cstage.itemName == "processrules") {
      this._router.navigate(['ipr-settings', 'process'] , { state: state_obj});
    } else if (cstage.itemName == "qualcriteria") {
      this._router.navigate(['ipr-settings', 'qualification'] , { state: state_obj});
    } else if (cstage.itemName == "evalcriteria") {
      this._router.navigate(['ipr-settings', 'evaluation'], { state:state_obj });
    }
  }

  loadMoreIPRListing(): void {

    this.pageNumber = this.pageNumber + 1;
    this.isLoadingData = true;
    this.fetchIPRListing();
  }

  fetchLovData(): void {

    this._spinnerService.show();
    let _url = environment.baseUrl + APP_URL.BUSINESS_LOV_IPR_PROCESS;

    this._lovService.getLovList(_url).subscribe(res => {
      if (res.status === ServiceResponse.STATUS_SUCCESS) {

        let data = res.response.data;
        this.lovDataObj = data;

      } else {
        swal.fire({ text: res.error, icon: 'error' });
      }
    });
  }

  initiateFilter(selField: string, selLabel: string, dataType: string): void {

    let initiate = true;

    this.filterCondArr.forEach((fc) => {
      if (fc['fieldName'] == selField) {
        this.toast.fire({
          icon: 'error',
          title: 'Filter is already applied for the selected condition.'
        });

        initiate = false;
      }
    });

    if (initiate) {

      let filterDataObj = { _selLabel: selLabel, _dataType: dataType };

      if (dataType == 'dropdown') {
        filterDataObj['lovData'] = this.lovDataObj[selField];
      }

      const dialogRef = this._dialog.open(FilterComponent, {
        width: '250px',
        data: filterDataObj
      });

      dialogRef.afterClosed().subscribe(result => {

        if (result) {

          let filterObj = {
            fieldName: selField,
            fieldValue: result,
            fieldLabel: selLabel,
            fieldValueType: dataType
          }

          if (dataType == 'date') {
            result = result;

            let startDateStr = this._datepipe.transform(result, this.REQUEST_DATE_FORMAT);

            let endDate = new Date(result);
            endDate.setHours(23, 59, 59, 0);
            let endDateStr = this._datepipe.transform(endDate, this.REQUEST_DATE_FORMAT);

            filterObj["fieldValue"] = startDateStr;

            filterObj["startDate"] = startDateStr;
            filterObj["startDateFormat"] = this.REQUEST_DATE_FORMAT;
            filterObj["endDate"] = endDateStr;
            filterObj["endDateFormat"] = this.REQUEST_DATE_FORMAT;

          }
          else if (dataType == 'dropdown') {

            filterObj["fieldValue"] = parseInt(result);

            let lovArr = this.lovDataObj[selField];
            lovArr.forEach(ele => {

              if (result == ele['id']) {
                filterObj["fieldValueLbl"] = ele['itemName'];
                return;
              }
            });
          }
          else {
            filterObj["fieldValue"] = result;
          }

          this.filterCondArr.push(filterObj);
          this.applyFilter();
        }
      });
    }
  }

  applyFilter(): void {

    if (this.filterCondArr.length > 0) {
      this.iprList = [];
      this.pageNumber = 1;
      this.fetchIPRListing();
    }
  }

  removeFilter(idx: number): void {

    this.filterCondArr.splice(idx, 1);
    this.iprList = [];
    this.pageNumber = 1;
    this.fetchIPRListing();
  }

  createIPR(creationType: string, lovId: number): void {

    var processData = {
      'id': null,
      'iprCreationType': lovId
    }

    this.saveIPRProcess(processData, true, creationType);
  }

  resumeIPRProcess(idx: number): void {

    let iprData = this.iprList[idx];
    this._router.navigate(['ipr/quick'], { state: { "id": iprData["id"], "uniqueRef": iprData["uniqueRef"] } });
  }

  saveIPRProcess(processData: object, isNavigate: boolean, creationType: string): void {
    if (creationType == IprProcessService.CREATE_IPR) {
      this._router.navigate(['ipr/create']);
      return;
    }
    
    let _url = environment.baseUrl + APP_URL.BUSINESS_SAVE_IPR_PROCESS;
    let data = { "reqData": processData };

    const dialogRef = this._dialog.open(ProgressStepComponent, {
      width: '40%',
      height: '80%',
      disableClose: true,
      data: {
        stepList: [{ "name": "Quick IPR", }, { "name": "RFP Document" },
        { "name": "Process Rule" }, { "name": "Calendar Rules (RFP)" },
        { "name": "Qualification Criteria" }, { "name": "Evaluation Criteria" }]
      }
    });

    this._processService.saveIPRProcess(_url, data).subscribe(res => {

      dialogRef.close();

      if (res.status === ServiceResponse.STATUS_SUCCESS) {

        if (isNavigate == false) {
          this.Toast.fire({
            icon: 'success',
            title: 'Insurance Purchase Request initiated successfully'
          })
        }

        let data = res.response.data;
        if (isNavigate == true) {
          if (creationType == "quickIPR") {
            this._router.navigate(['ipr/quick'], { state: { "id": data["id"], "uniqueRef": data["uniqueRef"] } });
          }
        }

      } else {
        swal.fire({ text: res.error, icon: 'error' });
      }
    }, error => {
      dialogRef.close();
      swal.fire({ text: "Something went wrong while saving IPR Process. Please try again.", icon: 'error' });
    });
  }

  getDate(date) {
    if (date) {
      return new Date(date);
    }
    return null;
  }

  redirect(ipr, link) {
    
    ipr["itemType"] = this.iprProcessType;
    this._router.navigate([link], { state: ipr });
  
  }
}
