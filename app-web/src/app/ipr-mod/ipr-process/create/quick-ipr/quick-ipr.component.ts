import { Location } from '@angular/common';
import { Route } from '@angular/compiler/src/core';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { APP_URL } from 'src/app/common/app-urls/app-urls';
import { DocumentService } from 'src/app/common/document/document.service';
import { LovFetcherService } from 'src/app/common/lov-fetcher/lov-fetcher.service';
import { RegisterService } from 'src/app/common/register-service/register.service';
import { ServiceResponse } from 'src/app/common/service-response';
import { RulesService } from 'src/app/ipr-mod/rules/rules.service';
import { environment } from 'src/environments/environment';
import swal from 'sweetalert2';
import { IprProcessService } from '../../ipr-process.service';

@Component({
  selector: 'app-quick-ipr',
  templateUrl: './quick-ipr.component.html',
  styleUrls: ['./quick-ipr.component.css']
})
export class QuickIprComponent implements OnInit {

  Toast = swal.mixin({
    toast: true,
    position: 'bottom',
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
  });

  STEPPER_DATA_LIST: Array<any>;
  processData: Object;
  processItemType: string;
  lovDataObj: any;

  /** Calendar */
  calendarRules: any;
  calendarType = "Standard";
  issueDate: Date;

  calendarDetails: FormGroup = this._fb.group({
    calendarType: [this.calendarType, [Validators.required]],
    startDate: ['', [Validators.required]],
    endDate: ['', [Validators.required]],
  });

  /** Document */
  documentList: Array<any> = [];
  documentItemType: string = null;
  allowdMime = ["application/pdf", "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
  docFile = null;

  /** IPR Basic details */
  iprBasicDetails: FormGroup = this._fb.group({
    id: ['', [Validators.required]],
    iprTitle: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(241)]],
    insCategory: ['', [Validators.required]],
    insPlanCategory: ['', [Validators.required]],
    insPlanType: ['', [Validators.required]],
    insPolicyType: ['', [Validators.required]],
  });

  /** IPR Process Options */
  iprProcOptions: FormGroup = this._fb.group({
    iprType: ['', [Validators.required]],
    bidType: ['', [Validators.required]],
  });


  /** IPR Issuance  */
  allInsComp;
  selInsCompanies: Array<any> = [];

  /** Invitation to Insurers */
  invitations;
  isEditable: boolean = true;

  id;
  uniqueRef;

  constructor(
    private _fb: FormBuilder,
    private _spinnerService: NgxSpinnerService,
    private _rulesService: RulesService,
    private _lovService: LovFetcherService,
    private _processService: IprProcessService,
    private _doctServ: DocumentService,
    private _regService: RegisterService,
    private _router: Router,
    private _changeDetectorRef: ChangeDetectorRef,
    private _location: Location
  ) {
    let navData = this._router.getCurrentNavigation();
    if (navData && navData.extras && navData.extras.state && navData.extras.state.id && navData.extras.state.uniqueRef) {
      if (navData.extras.state.id && navData.extras.state.uniqueRef) {
        this.id = navData.extras.state.id;
        this.uniqueRef = navData.extras.state.uniqueRef;
      }
    }
  }


  @ViewChild('stepper') stepper;

  ngOnInit(): void {
    this.fetchLovData();
  }

  onStepChange(event: any) {
    this.callAPI(this.STEPPER_DATA_LIST[event.selectedIndex]);
  }

  callAPI(stepData) {
    if (stepData?.itemName == 'iprdocument') {
      this.fetchAllDocuments();
    } else if (stepData?.itemName == "invitationtoinsurers" && !this.allInsComp) {
      this.getInsuranceCompList();
    }
  }

  getDocNameByCategory() {

    let insCat = this.lovDataObj["insuranceCategory"].find(e => e.id == this.iprBasicDetails.get("insCategory").value)["id"];
    let insPlanCat = this.lovDataObj["insurancePlanCategory"].find(e => e.id == this.iprBasicDetails.get("insPlanCategory").value)["id"];
    return insCat + "," + insPlanCat;

  }

  fetchAllDocuments() {

    if (!this.processData) {
      this.Toast.fire({
        icon: 'error',
        title: 'Process IPR not found.'
      })

      return;
    }

    this._spinnerService.show();
    this._doctServ.fetchAllDocument({ "itemId": this.processData["id"], "itemType": this.processItemType }).subscribe(res => {

      if (res.status === ServiceResponse.STATUS_SUCCESS) {
        this.documentList = res.response.data;
        this.documentItemType = res.response.itemType;

        if (this.documentList != null) {
          let allAttUrl = environment.baseUrl + APP_URL.BUSINESS_FETCH_ALL_ATTACH;
          let itemdIds = [];
          for (let doc of this.documentList) {
            if (doc["id"] != null) {
              itemdIds.push(doc["id"]);
            }
          }

          let reqParam = { "itemIdList": itemdIds, "itemType": this.documentItemType };

          this._rulesService.getAllAttachments(allAttUrl, reqParam).subscribe(res => {
            if (res.status === ServiceResponse.STATUS_SUCCESS) {
              this._spinnerService.hide();
              let attachList = res.response["attachmentData"];
              for (let doc of this.documentList) {
                if (attachList[doc.id]) {
                  doc["attachment"] = attachList[doc.id];
                }
              }
            } else {
              this._spinnerService.hide();
            }
          }, error => {
            this._spinnerService.hide();
          });
        }
      }
    }, error => {
      this._spinnerService.hide();
    });
  }

  fetchLovData() {

    this._spinnerService.show();
    let _url = environment.baseUrl + APP_URL.BUSINESS_LOV_IPR_PROCESS;
    this._lovService.getLovList(_url).subscribe(res => {
      if (res.status === ServiceResponse.STATUS_SUCCESS) {

        let data = res.response.data;
        this.lovDataObj = data;

        this.fetchIPRPRocess();

      } else {
        swal.fire({ text: res.error, icon: 'error' });
      }
    });
  }

  fetchIPRPRocess() {
    
    if (!this.id || !this.uniqueRef) {
      this._location.back();
    }

    let _url = environment.baseUrl + APP_URL.BUSINESS_LOV_FETCH_IPR_PROCESS;

    let paramObj = { "id": this.id, "uniqueRef": this.uniqueRef };

    this._spinnerService.show();
    this._processService.fecthIPRProcess(_url, JSON.stringify(paramObj)).subscribe(res => {
      this._spinnerService.hide();
      if (res.status === ServiceResponse.STATUS_SUCCESS) {
        this.processItemType = res.response.itemType;
        this.processData = res.response.data;
        this.fetchAllStages("IPR_PROCESS", "QUICK_IPR_STAGES");
      } else {
        swal.fire(res.response.error, 'failure');
      }
    }, (err) => {
      this._spinnerService.hide();
    });
  }

  fetchAllStages(itemType, groupName) {

    let _url = environment.baseUrl + APP_URL.BUSINESS_FETCH_ALL_IPR_STAGES;
    let paramObj = { "itemType": itemType, "groupName": groupName };

    this._spinnerService.show();
    this._processService.fethAllStages(_url, JSON.stringify(paramObj)).subscribe(res => {

      this._spinnerService.hide();
      if (res.status === ServiceResponse.STATUS_SUCCESS) {

        if (res?.response?.data) {
          this.STEPPER_DATA_LIST = res.response.data;
          this._changeDetectorRef.detectChanges();
          this.updateProcessData();
          this._changeDetectorRef.detectChanges();
        } else {
          swal.fire("Stages not found for Quick IPR.", 'failure');
        }
      } else {
        swal.fire(res.response.error, 'failure');
      }
    }, (err) => {
      this._spinnerService.hide();
    });
  }

  updateProcessData() {

    if (this.processData) {

      this.patchFormValues(this.processData);
      let stepIndex = ((this.processData["processStep"] != undefined && this.processData["processStep"] != null && !isNaN(parseInt(this.processData["processStep"]))) ? Number(this.processData["processStep"]) : -1) + 1;

      for (let i in this.STEPPER_DATA_LIST) {
        if (Number(i) > Number(stepIndex)) {
          let stepData = this.STEPPER_DATA_LIST[i];
          stepData["completed"] = false;
        } else {
          let stepData = this.STEPPER_DATA_LIST[i];
          stepData["completed"] = true;
        }
      }

      if (Number(stepIndex) > -1) {
        this.stepper.linear = false;
        this.stepper.selectedIndex = stepIndex;
        setTimeout(() => {
          this.stepper.linear = true;
        });
      }

      this._changeDetectorRef.detectChanges();
      this.updateStepStyle();
      this._changeDetectorRef.detectChanges();
    }
  }

  patchFormValues(processData) {

    this.issueDate = this.processData["startDate"];

    if (processData["calendarType"]) {
      this.calendarType = processData["calendarType"];
    }

    this.calendarDetails.patchValue(processData);
    this.iprProcOptions.patchValue(processData);
    this.iprBasicDetails.patchValue(processData);
  }

  backStep() {
    this.stepper.previous();
    this.updateStepStyle();
  }

  nextStep() {
    this.updateStepData(this.stepper.selectedIndex);
  }

  updateStepStyle() {

    var matSteps = document.getElementsByClassName("mat-step-icon mat-step-icon-state-number");

    for (let i = 0; i < matSteps.length; i++) {
      if (i == this.stepper.selectedIndex) {
        matSteps[i]["style"].backgroundColor = "#f7b698";
        matSteps[i]["style"].border = "2px solid #ff6600";
        matSteps[i]["style"].color = "white";
        continue;
      }
      if (this.STEPPER_DATA_LIST[i]?.completed) {
        matSteps[i]["style"].backgroundColor = "#ff6600";
        matSteps[i]["style"].color = "white";
      } else {
        matSteps[i]["style"].backgroundColor = "white";
        matSteps[i]["style"].border = "2px solid #ff6600";
        matSteps[i]["style"].color = "black";
      }
    }
  }

  updateStepData(stepIndex) {

    let existIndex = this.processData["processStep"];

    if ((stepIndex == undefined || existIndex == undefined) || stepIndex >= existIndex) {
      this.processData["processStep"] = stepIndex;
    }

    let stepData = this.STEPPER_DATA_LIST[stepIndex]

    if (stepData?.itemName == "iprbasicdetails") {
      this.updateIprBasicDetails();
    } else if (stepData?.itemName == "iprprocessoptions") {
      this.updateIPRProcOptions();
    } else if (stepData?.itemName == "iprcalendar") {
      this.updateIPRCalendar();
    } else if (stepData?.itemName == "invitationtoinsurers") {
      this.updateIssOpt();
    } else if (stepData?.itemName == "iprdocument") {
      this.updateRFPDoc();
    } else {
      this.stepper.next();
    }

    this.updateStepStyle();

  }

  updateIssOpt() {

    if (this.selInsCompanies.length == 0) {
      this.Toast.fire({
        icon: 'error',
        title: 'Please select atleast 1 insurance company'
      })

      return;
    }

    this.saveInvitations(this.selInsCompanies);
  }

  saveInvitations(selInsCompanies) {
    if (selInsCompanies) {

      this._spinnerService.show();

      this.updateProcessId(selInsCompanies, "iprProcessId");



      let dataList = selInsCompanies.map(data => ({ insurerId: data.id, iprProcessId: data?.iprProcessId, id: data?.invtId, isInvite: data?.checked }));

      if (this.invitations) {

        let invts = this.invitations.filter(invt =>
          !dataList.some(ins => ins.insurerId == invt.insurerId)
        );

        invts.map(e => {
          e["isInvite"] = false;
        });

        dataList = dataList.concat(invts);
      }

      let saveInvtsUrl = environment.baseUrl + APP_URL.BUSINESS_SAVE_ALL_IPR_INVITATIONS;

      let reqBody = { "reqData": dataList };

      this._processService.saveInvitations(saveInvtsUrl, reqBody).subscribe(res => {

        if (res.status === ServiceResponse.STATUS_SUCCESS) {

          this.invitations = res.response.data;

          this.updateInsCompWithInvt(this.allInsComp, this.invitations);

          this.saveIPRProcess();

        } else {
          this._spinnerService.hide();
          swal.fire({ text: res.error, icon: 'error' });
        }
      }, (err) => {
        this._spinnerService.hide();
        swal.fire({ text: "Something went wrong while saving invitations . Please try again.", icon: 'error' });
      }
      );
    }
  }

  updateProcessId(dataList, key) {
    if (dataList) {
      for (let data of dataList) {
        data[key] = this.processData["id"];
      }
    }
  }

  updateRFPDoc() {

    if (!this.documentList || this.documentList.length == 0) {
      this.Toast.fire({
        icon: 'error',
        title: 'Please upload IPR Document'
      })
      return;
    }

    swal.fire({
      title: 'Your response has been recorded',
      text: "On clicking confirm, IPR will be issued",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm',
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        this.processData["iprStatus"] = "In Process";
        this.saveIPRProcess();
      }
    });
  }

  updateIPRCalendar() {

    let validData = this.isValidCalendarRules();

    if (!validData["valid"]) {
      this.Toast.fire({
        icon: 'error',
        title: validData?.message
      })

      return;
    }

    Object.assign(this.processData, this.calendarDetails.value);
    this._spinnerService.show();
    let _url = environment.baseUrl + APP_URL.BUSINESS_SAVE_RULES;

    this._rulesService.saveRules(_url, this.calendarRules).subscribe((res) => {

      if (res.status === ServiceResponse.STATUS_SUCCESS) {
        this.saveIPRProcess();

      } else {

        this._spinnerService.hide();
        swal.fire({ text: res.error, icon: 'error' });

      }
    }, (err) => {

      this._spinnerService.hide();
      swal.fire({ text: "Something went wrong while saving Calendar Rules. Please try again.", icon: 'error' });

    })
  }

  updateIPRProcOptions() {
    if (!this.iprProcOptions.valid) {
      return;
    }
    Object.assign(this.processData, this.iprProcOptions.value);
    this.saveIPRProcess();
  }

  updateIprBasicDetails() {

    if (!this.iprBasicDetails.valid) {
      return;
    }

    Object.assign(this.processData, this.iprBasicDetails.value);
    this.saveIPRProcess();
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

  ngAfterViewInit() {
    this.stepper._getIndicatorType = () => 'number';
  }

  saveIPRProcess() {

    this._spinnerService.show();
    let _url = environment.baseUrl + APP_URL.BUSINESS_SAVE_IPR_PROCESS;
    let data = { "reqData": this.processData };

    this._processService.saveIPRProcess(_url, data).subscribe(res => {

      this._spinnerService.hide();
      if (res.status === ServiceResponse.STATUS_SUCCESS) {

        this.Toast.fire({
          icon: 'success',
          title: 'Successully saved IPR Process'
        });

        let stepIndex = this.processData["processStep"];
        let stepData = this.STEPPER_DATA_LIST[stepIndex];
        stepData["completed"] = true;

        this._changeDetectorRef.detectChanges();

        this.stepper.next();
        this.updateStepStyle();

      } else {
        swal.fire({ text: res.error, icon: 'error' });
      }
    }, error => {
      swal.fire({ text: "Something went wrong while saving IPR Process. Please try again.", icon: 'error' });
    });
  }

  getFileIcon(fileName) {

    if (fileName && fileName.indexOf(".") > -1) {
      let ext = fileName.split(".").pop();
      if (ext == "pdf") {
        return "fas fa-file-pdf color-red";
      } else {
        return "fas fa-file-word color-blue";
      }
    }
    return "";
  }

  downloadTemplate() {

    this._spinnerService.show();
    let docName = this.getDocNameByCategory();
    var splittedProperties = docName.split(",", 2);
    
    let jsonProps = "{";
    jsonProps += '"insuranceCategory":';
    jsonProps += splittedProperties[0];
    jsonProps += ",";
    jsonProps += '"insurancePlanCategory":';
    jsonProps += splittedProperties[1];
    jsonProps += "}";    
    let iprDocReq = { "name": jsonProps, "itemTtype": "IPRRules" };

    this._doctServ.fetchDocByName(iprDocReq).subscribe(res => {

      if (res.status === ServiceResponse.STATUS_SUCCESS) {
        if (res.response.data) {
          let attachment = res.response.data;
          this.downloadTempByAttach(attachment, res.response.itemType, "DOCUMENT");
        } else {
          swal.fire({ text: "Template not found", icon: 'error' });
          this._spinnerService.hide();
        }
      } else {
        swal.fire({ text: res.error, icon: 'error' });
        this._spinnerService.hide();
      }

    }, error => {

      this._spinnerService.hide();
      this.Toast.fire({
        icon: 'error',
        title: 'Something went wrong while fetching document'
      })
    });
  }

  downloadTempByAttach(attachment, itemType, attachType) {

    this._regService.getAttachment({ itemId: attachment['id'], itemType: itemType, attachType: attachType }).subscribe((data) => {

      this._spinnerService.hide();

      if (data.status == ServiceResponse.STATUS_SUCCESS) {
        if (!data.response || !data.response.attachmentData) {
          this.Toast.fire({
            icon: 'error',
            title: 'File not found for selected category'
          })
          return;
        }

        let imageData = data.response.attachmentData;
        let ext = imageData.fileName.substr(imageData.fileName.lastIndexOf('.') + 1);
        let docData = imageData.data;
        let fileName = imageData["fileName"];

        if (ext == "doc") {
          let link = document.createElement('a');
          link.innerHTML = 'Download DOC file';
          link.download = fileName;
          link.href = 'data:application/octet-stream;base64,' + docData;
          link.click();
          window.URL.revokeObjectURL(link.href);
        }

        if (ext == "docx") {
          let link = document.createElement('a');
          link.innerHTML = 'Download PDF file';
          link.download = fileName;
          link.href = 'data:application/octet-stream;base64,' + docData;
          link.click();
          window.URL.revokeObjectURL(link.href);
        }

        if (ext == "pdf") {
          let link = document.createElement('a');
          link.innerHTML = 'Download PDF file';
          link.download = fileName;
          link.href = 'data:application/octet-stream;base64,' + docData;
          link.click();
          window.URL.revokeObjectURL(link.href);
        }

        this._spinnerService.hide();

      } else {
        swal.fire({ text: data.error, icon: 'error' });
        this._spinnerService.hide();
      }
    }, error => {
      swal.fire({ text: "Something went wrong while downloading file", icon: 'error' });
    });
  }

  uploadFile(files) {

    if (files.length === 0)
      return;

    let mimeType = files[0].type;
    if (this.allowdMime.indexOf(mimeType) < 0) {
      swal.fire({ text: "Uploaded filed is not allowed, allowed extensions are pdf, doc and docx. ", icon: 'error' });
      return;
    }

    this.docFile = files[0];
    this.saveFile();
  }

  /** This function is use to save file */
  saveFile() {

    let formData = new FormData()
    formData.append('selectedFile', this.docFile);
    formData.append('itemId', this.processData["id"]);
    formData.append('itemType', this.processItemType);
    formData.append('attachType', "DOCUMENT");
    formData.append('rfpDocumentTemplate', "RFP Document Template");
    var properties = this.getDocNameByCategory();
    var splittedProperties = properties.split(",", 2);
    
    let jsonProps = "{";
    jsonProps += '"insuranceCategory":';
    jsonProps += splittedProperties[0];
    jsonProps += ",";
    jsonProps += '"insurancePlanCategory":';
    jsonProps += splittedProperties[1];
    jsonProps += "}";

    formData.append('properties', jsonProps);

    let _url_save_doc = environment.baseUrl + APP_URL.BUSINESS_SAVE_DOCUMENT;

    this._spinnerService.show();
    this._doctServ.saveDocument(_url_save_doc, formData).subscribe(res => {

      if (res.status === ServiceResponse.STATUS_SUCCESS) {
        this.fetchAllDocuments();
        this.Toast.fire({
          icon: 'success',
          title: 'Documents Uploaded Successfully.'
        })

      } else {

        this._spinnerService.hide();
        swal.fire({ text: res.error, icon: 'error' });

      }
    });
  }

  /** This function is use to delete specified document */
  deleteDoc(document) {

    let formData = { 'id': document["id"], 'itemId': this.processData["id"], 'itemType': this.processItemType }
    let docDeleteUrl = environment.baseUrl + APP_URL.BUSINESS_DELETE_DOCUMENT;

    this._spinnerService.show();
    this._doctServ.deleteDocument(docDeleteUrl, formData).subscribe(res => {

      if (res.status === ServiceResponse.STATUS_SUCCESS) {

        this.documentList.splice(this.documentList.findIndex(e => e.id == document["id"]), 1);
        this._spinnerService.hide();

        this.Toast.fire({
          icon: 'success',
          title: 'Document Deleted Successfully'
        })

        this.fetchAllDocuments();
      } else {

        this._spinnerService.hide();
        swal.fire({ text: res.error, icon: 'error' });

      }
    }, error => {
      this._spinnerService.hide();
      swal.fire({ text: "Something went wrong while deleteing document.", icon: 'error' });
    })
  }


  /** This function is use to get all insurance companies and 
   * update in  allInsComp*/
  getInsuranceCompList() {

    this._spinnerService.show();

    return new Promise((resolve) => {

      let _url = environment.baseUrl + APP_URL.INSURANCE_COMPANIES_LIST;

      this._lovService.getLovList(_url).subscribe(res => {

        if (res.status === ServiceResponse.STATUS_SUCCESS) {

          let allInsComp = res.response.data;

          let fetchInvtsUrl = environment.baseUrl + APP_URL.BUSINESS_FETCH_ALL_INVITATIONS_BY_PROCESS_ID;

          let reqData = { "processId": this.processData["id"] };

          this._processService.fecthAllInvitations(fetchInvtsUrl, reqData).subscribe(res => {

            if (res.status === ServiceResponse.STATUS_SUCCESS) {

              let isInvtOpenToAll = this.isInvtOpenToAll(this.processData["iprParticipation"]);

              if (isInvtOpenToAll == true) {

                allInsComp.map(e => {
                  e["checked"] = true;
                });

                this.isEditable = false;
                this.allInsComp = allInsComp;
              }

              this.invitations = res.response.data;
              let invts = res.response.data;

              this.updateInsCompWithInvt(allInsComp, invts);

              this.allInsComp = allInsComp;
              this._spinnerService.hide();

            } else {
              this._spinnerService.hide();
              swal.fire({ text: res.error, icon: 'error' });
            }
          }, (err) => {
            this._spinnerService.hide();
            swal.fire({ text: "Something went wrong while fetching invitations. Please try again.", icon: 'error' });
          }
          );
        } else {
          this.allInsComp = [];
        }
        resolve(true);
      }, (err) => {
        resolve(false);
        this._spinnerService.hide();
      });
    })
  }

  updateInsCompWithInvt(insCompanies, invts) {
    insCompanies.filter(ins =>
      invts.some(invt => ins.id == invt.insurerId)
    ).map(e => {

      let invt = invts.find(invt => invt.insurerId == e.id);
      e["checked"] = invt["isInvite"];
      e["invtId"] = invt ? invt["id"] : null;
      return e;

    })
  }

  onInsChecked(dataList) {
    this.selInsCompanies = dataList;
  }

  getUpdatedCalData(calData) {
    if (calData) {
      this.calendarDetails.patchValue(calData?.calDetails);
      this.calendarRules = calData?.calRules;
    }
  }

  isInvtOpenToAll(iprParticipation) {

    if (iprParticipation) {
      let lovItems = this.lovDataObj["iprProcessRulePart"].filter(e => e["id"] == iprParticipation);

      if (lovItems.length > 0) {
        let lovItem = lovItems[0];
        return lovItem["itemValue"] == "openToAll"
      }

    }

    return false
  }

}

