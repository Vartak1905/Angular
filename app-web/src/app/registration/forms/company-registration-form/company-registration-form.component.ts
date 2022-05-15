import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray, ValidatorFn } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ServiceResponse } from 'src/app/common/service-response';
import { NgxSpinnerService } from 'ngx-spinner';
import { LovFetcherService } from 'src/app/common/lov-fetcher/lov-fetcher.service';
import { APP_URL } from 'src/app/common/app-urls/app-urls';
import { Router, ActivatedRoute } from '@angular/router';
import { RegisterService } from 'src/app/common/register-service/register.service';
import swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { Client } from 'src/app/common/entity/client/client';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { ImageViewerComponent } from 'src/app/common/image-viewer/image-viewer.component';
import { TableViewService } from 'src/app/app-widgets/table/table-view/table-view.service';
import { Location } from '@angular/common';
import { AppLayoutService } from 'src/app/app-layout/app-layout.service';

@Component({
  selector: 'app-company-registration-form',
  templateUrl: './company-registration-form.component.html',
  styleUrls: ['./company-registration-form.component.css']
})
export class CompanyRegistrationFormComponent implements OnInit {

  companyDetails: FormGroup;
  client: Client;
  comment: string;
  curRegStatus: string;

  status = [{
    itemValue: 'Accept',
    id: 1
  }];

  fileDetails = {
    pan: { itemId: null, itemType: '', show: false, src: null },
    cin: { itemId: null, itemType: '', show: false, src: null },
    gst: { itemId: null, itemType: '', show: false, src: null }
  };

  selectedFile: Object = {
    pan: null,
    cin: null,
    gst: null
  };

  noOfEmpMandatory = true;
  assignBeaOption = true;
  showPanAddValidateButton = true;
  showPanViewButton = false;
  legalEntityMandatory = true;
  showAePanGstViewButton = false;
  regStatusMandatory = false;
  InactivationShow = false;
  InactivationMandatory = false;
  businessEntities = [];
  entitiesChecked = {};

  legalEntityDrodown = [];
  inactivationReasons = [];
  businessEntityTypeCheckBox = [];
  businessEntityObj = {};
  categoryRadioButtons = [];
  industryDropdown = [];
  noOfEmployeesDropdown = [];
  countries = [];
  states = [];
  cities = [];
  pincodes = [];

  isPageInsider: boolean = true;
  isSameAsAdmin: boolean = false;
  isSameAsRegAdd: boolean = false;

  @Input() additional_detail: boolean = false;
  @Input() edit_mode: boolean = false;
  @Input() add_mode: boolean = false;
  @Input() readonly: boolean = false;

  constructor(
    private _fb: FormBuilder,
    private _lovService: LovFetcherService,
    private _spinnerService: NgxSpinnerService,
    private _tableService: TableViewService,
    private _router: Router,
    private _registerService: RegisterService,
    private _dialog: MatDialog,
    private _location: Location,
    private _elementRef: ElementRef,
    private _layoutService: AppLayoutService
  ) { }

  ngOnInit(): void {
    this.getLovData();
    this.addFormFields();
    this.onClientAdminDetailChange();
    if (this.additional_detail) {
      this.onCorrAddressDetailChange();
    }
  }

  ngOnDestroy(): void {
    this._tableService.selRecord = null;
  }

  private addFormFields() {

    let clientAdminDetails = this._fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-z ,.'-]+$/i)]],
      designation: ['', [Validators.required,Validators.pattern(/^[a-zA-Z]+$/)]],
      emailAddress: ['', [Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      mobileNo: ['', [Validators.required, Validators.pattern(/^(7|8|9)\d{9}$/)]],
    });

    let requesterDetails = this._fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-z ,.'-]+$/i)]],
      designation: ['', [Validators.required,Validators.pattern(/^[a-zA-Z]+$/)]],
      emailAddress: ['', [Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      mobileNo: ['', [Validators.required, Validators.pattern(/^(7|8|9)\d{9}$/)]],
    });

    let adminDetails = this._fb.group({
      name: ['', []],
      designation: ['', []],
      emailAddress: ['', []],
      mobileNo: ['', []],
    });

    let officeAddressDetails = this._fb.group({
      line1: ['',[Validators.required,Validators.minLength(2)]],
      line2: ['',[Validators.required,Validators.minLength(2)]],
      area: ['', [Validators.required,Validators.minLength(2)]],
      country: ['0', [Validators.required]],
      state: ['0', [Validators.required]],
      city: ['0', [Validators.required]],
      pincode: ['0', [Validators.required]],
    });

    let corrAddressDetails = this._fb.group({
      line1: ['',[Validators.required,Validators.minLength(2)]],
      line2: ['',[Validators.required,Validators.minLength(2)]],
      area: ['', [Validators.required,Validators.minLength(2)]],
      country: ['0', [Validators.required]],
      state: ['0', [Validators.required]],
      city: ['0', [Validators.required]],
      pincode: ['0', [Validators.required]],
    });

    let clientDetails;
    if (this.additional_detail) {
      clientDetails = this._fb.group({
        employeeCount: ['', []],
        panNumber: ['', [Validators.required,Validators.pattern(/([A-Z]){5}([0-9]){4}([A-Z]){1}$/)]],
        panValid: [{ value: true, disabled: true }, []],
        cinNumber: ['', [Validators.required,Validators.pattern(/^([L|U]{1})([0-9]{5})([A-Za-z]{2})([0-9]{4})([A-Za-z]{3})([0-9]{6})$/)]],
        cinValid: [{ value: true, disabled: true }, []],
        gstNumber: ['', [Validators.required, Validators.pattern(/\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/)]],
        officeAddress: officeAddressDetails,
        sameAsRegOff: ['', []],
        corrAddress: corrAddressDetails,
        panImage: ['', [RxwebValidators.extension({ extensions: ['jpeg', 'jpg', 'png'] })]],
        cinImage: ['', [RxwebValidators.extension({ extensions: ['jpeg', 'jpg', 'png'] })]],
        gstImage: ['', [RxwebValidators.extension({ extensions: ['jpeg', 'jpg', 'png'] })]]
      });
    } else {
      clientDetails = this._fb.group({
        employeeCount: ['', []],
      });
    }

    this.companyDetails = this._fb.group({
      id: ['', []],
      companyName: ['', [Validators.required]],
      legalEntity: ['', [Validators.required]],
      // businessEntityType: [null, [Validators.required]],
      insuranceCategory: [null, [Validators.required]],
      industryType: ['', [Validators.required]],
      source: [this.additional_detail ? 'internal' : 'online', []],
      registrationStatus: ['', []],
      isInActive: [false, []],
      inactivationReason: ['', []],
      inactivationRemarks: ['', []],
      clientDetails: clientDetails,
      clientAdmin: clientAdminDetails,
      rrbCheckBox: ['', []],
      requester: requesterDetails,
      adminDetails: adminDetails,
      currentState: ['', []],
      isAccountActivated: [false, []]
    });
  }

  createCheckbox(checkBoxInputs, selected = []) {

    const arr = checkBoxInputs.map(hobby => {
      let index = selected.findIndex(id => id == hobby.id);
      var check = false;
      if (index != -1) {
        check = true;
      }
      return new FormControl(check);
    });
    return new FormArray(arr);
  }

  private autoAddFormData() {
    if (this._tableService.selRecord != null && this._tableService.selMenu) {

      if (this._tableService.selMenu['owner'] == 'addclient') {
        this.fetchClient(this._tableService.selRecord['id']);
      }
      else if (this._tableService.selMenu['owner'] == 'addclient-req') {
        this.fetchClient(this._tableService.selRecord['itemId']);
      }
    }
  }

  private patchFormValues(client: Client) {
    this.businessEntities = client.businessEntityType ? JSON.parse(client.businessEntityType) : [];
    let checkBoxValues = [];
    this.businessEntityTypeCheckBox.forEach(element => {
      let value = false;
      this.entitiesChecked[element.itemName] = false;
      let index = this.businessEntities.findIndex(x => x === element.id);
      if (index != -1) {
        value = true;
        this.entitiesChecked[element.itemName] = value;
      }
      checkBoxValues.push(value);
    });

    delete client.businessEntityType;
    this.companyDetails.controls.businessEntityType.setValue(checkBoxValues);
    this.addRemoveFields();
    this.companyDetails.patchValue(client);
    this.curRegStatus = this.companyDetails.get("registrationStatus").value;
    this.setValidatorsForInActiveStatus(this.companyDetails.get("isInActive").value);
  }

  setFileValues(data, itemType) {
    if (data.clientDetails.panNumber) {
      this.fileDetails.pan = { itemId: data.id, itemType: itemType, show: true, src: null };
    }
    if (data.clientDetails.gstNumber) {
      this.fileDetails.gst = { itemId: data.id, itemType: itemType, show: true, src: null };
    }
    if (data.clientDetails.cinNumber) {
      this.fileDetails.cin = { itemId: data.id, itemType: itemType, show: true, src: null };
    }
  }

  private fetchClient(id: Number) {

    let _url = environment.baseUrl + APP_URL.BUSINESS_FETCH_CLIENT;
    let paramObj = {};
    paramObj['itemId'] = id;

    this._spinnerService.show();
    this._registerService.fetchClient(_url, JSON.stringify(paramObj)).subscribe(res => {

      this._spinnerService.hide();
      if (res.status === ServiceResponse.STATUS_SUCCESS) {
        let data = res.response.data;
        this.comment = res.response.comment;
        this.patchFormValues(data);
        this.setFileValues(data, res.response.itemType);
        let roleList = this._layoutService.user['roleList'];
        if (roleList) {
          // let index = "Account Executive Under Approval";
          let index = roleList.findIndex(item => item.name == "Account Executive");
          if (index != -1) {
            if ( data.registrationStatus == "Under Approval") {
              this.companyDetails.disable();
            } else if(data.registrationStatus == "Active") {
              this.companyDetails.disable();
              this.companyDetails.get('clientAdmin').enable();
              this.companyDetails.get('clientDetails').get('officeAddress').enable();
              this.companyDetails.get('clientDetails').get('corrAddress').enable();
              this.companyDetails.get('clientDetails').get('sameAsRegOff').enable();
              // this.companyDetails.get('source').enable();
              // this.companyDetails.get('adminDetails').get('name').enable();
            }
            
          } else {
            index = roleList.findIndex(item => item.name == "Business Development Leader");
            if (index != -1 ) {
              if (data.registrationStatus == "Under Validation") {
                this.companyDetails.disable();
              } else if(data.registrationStatus == "Active") {
                this.companyDetails.disable();
                this.companyDetails.get('clientAdmin').enable();
                this.companyDetails.get('clientDetails').get('officeAddress').enable();
                this.companyDetails.get('clientDetails').get('corrAddress').enable();
                this.companyDetails.get('clientDetails').get('sameAsRegOff').enable();
                this.companyDetails.get('source').enable();
                this.companyDetails.get('adminDetails').get('name').enable();
              }
              
            }
          }
          // var check = false;
          // if (index != -1) {
          //   check = true;
          // }
        }
      } else {
        swal.fire(res.response.error, 'failure');
      }
    }, () => {
      this._spinnerService.hide();
    });
  }

  onSelImage(files, name) {
    if (files.length === 0)
      return;

    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    this.selectedFile[name] = files[0];
    var reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.fileDetails[name]['src'] = reader.result;
      this.fileDetails[name]['show'] = true;
    }
  }

  openImageModal(type) {
    if (this.fileDetails[type]['src']) {
      let title = 'Image Viewer';
      this.openImagePop(title, this.fileDetails[type]['src']);
    } else {
      this.loadImage(type);
    }

  }

  loadImage(type) {
    this._spinnerService.show();
    this._registerService.getAttachment({ itemId: this.fileDetails[type]['itemId'], itemType: this.fileDetails[type]['itemType'], attachType: type.toUpperCase() }).subscribe((data) => {
      this._spinnerService.hide();
      if (data.status == ServiceResponse.STATUS_SUCCESS && data.response && data.response.attachmentData) {
        let imageData = data.response.attachmentData;
        this.fileDetails[type]['src'] = "data:image/jpeg;base64," + imageData.data;
        this.openImagePop('Image Viewer', this.fileDetails[type]['src']);
      }
    }, (err) => {
      this._spinnerService.hide();
    })
  }

  openImagePop(title, imgSrc) {
    const dialogRef = this._dialog.open(ImageViewerComponent, {
      data: { src: imgSrc, title: title },
      width: '80%',
      height: '90vh'
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  private getLovData() {

    this._spinnerService.show();
    let _url = environment.baseUrl + APP_URL.BUSINESS_LOV_REGISTRATION;
    this._lovService.getLovList(_url).subscribe(res => {

      this._spinnerService.hide();
      if (res.status === ServiceResponse.STATUS_SUCCESS) {
        let data = res.response.data;
        this.industryDropdown = data.industryType;
        this.legalEntityDrodown = data.legalEntity;
        this.noOfEmployeesDropdown = data.employeeCount;
        this.inactivationReasons = data.inActiveReason;

        this.businessEntityTypeCheckBox = data.businessEntityType;
        this.businessEntityTypeCheckBox.forEach(element => {
          this.businessEntityObj[element.id] = element.itemName;
        });

        this.companyDetails.addControl('businessEntityType', this.createCheckbox(this.businessEntityTypeCheckBox),);
        this.autoAddFormData();
        this.categoryRadioButtons = data.insuranceCategory;
        this.countries = data.country;
        this.cities = data.city;
        this.states = data.state;
        this.pincodes = data.pincode;
        // this.lovDataObj = res.response.data;
      } else {
        swal.fire(res.error, 'failure');
      }
    }, () => {
      this._spinnerService.hide();
    });
  }

  onCategoryChange(category) {
    this.companyDetails.get('insuranceCategory').setValue(category);
  }

  onBusinessEntityValueChange(event, businessEntityType) {
    if (event.checked) {
      this.businessEntities.push(businessEntityType.id);
      this.entitiesChecked[businessEntityType.itemName] = true;
    } else {
      let index = this.businessEntities.findIndex(x => x === businessEntityType.id);
      if (index != -1) {
        this.businessEntities.splice(index, 1);
        this.entitiesChecked[businessEntityType.itemName] = false;
      }
    }
    //check which checkbox is checked and remove and add fields according to it.
    this.addRemoveFields();
  }
  addRemoveFields() {
    if (this.entitiesChecked['Insurance Buyer']) {
      this.companyDetails.addControl('industryType', new FormControl('0', [Validators.required]));
      let clientForm: any = this.companyDetails.get('clientDetails');
      clientForm.addControl('employeeCount', new FormControl(null, [Validators.required]))
    } else {
      this.companyDetails.removeControl('industryType');
      this.companyDetails.removeControl('employeeCount');

    }
    if (this.entitiesChecked['Insurance Company']) {
      this.companyDetails.addControl('insuranceCategory', new FormControl(null, [Validators.required]));
    } else {
      this.companyDetails.removeControl('insuranceCategory');
    }
  }
  onRrbCheckBoxValueChange(value: boolean) {

    this.isSameAsAdmin = !this.isSameAsAdmin;
    if (this.isSameAsAdmin) {
      this.companyDetails.controls.requester.patchValue(this.companyDetails.get('clientAdmin').value);
    } else {
      this.companyDetails.controls.requester.reset();
    }
  }

  copyRegisteredOfficeAddress(value: boolean) {
    this.isSameAsRegAdd = !this.isSameAsRegAdd;
    if (this.isSameAsRegAdd) {
      this.companyDetails.get('clientDetails').get('corrAddress').patchValue(this.companyDetails.get('clientDetails').get('officeAddress').value);
    } else {
      this.companyDetails.get('clientDetails').get('corrAddress').reset();
    }
  }

  saveDetails() {

    let isFormValid = this.validateFormData();

    if (isFormValid) {

      this.client = this.companyDetails.value;
      this.client.businessEntityType = JSON.stringify(this.businessEntities);

      this._spinnerService.show();
      let _url = environment.baseUrl + APP_URL.BUSINESS_ADD_CLIENT;

      this._registerService.submitCompanyData(_url, this.client).subscribe(async (res) => {
        this._spinnerService.hide();
        if (res.status === ServiceResponse.STATUS_SUCCESS) {

          swal.fire({
            text: 'Company registered successfully. An email will be sent once the account is activated',
            icon: 'success',
            onClose: () => {
              this._location.back();
              //this._router.navigate(['dashboard']);
            }
          });
          if (this.selectedFile && res.response && res.response.data && res.response.data.id) {
            // need to call this in loop as there might be multiple uploaded files, 
            // also need to check whether the file was changed 

            for (const property in this.selectedFile) {
              if (this.selectedFile[property]) {
                await this.saveAttachment(res.response.data.id, res.response.itemType, property);
              }
            }
          }

        } else {
          swal.fire({ text: res.error, icon: 'error' });
        }
      }, (err) => {
        swal.fire({ text: 'Something went wrong.', icon: 'error' });
        this._spinnerService.hide();
      });
    }
  }

  validateFormData() {

    if (!this.companyDetails.valid) {
      this.companyDetails.markAllAsTouched();
      this.moveToInvalidElement();
    }
    return this.companyDetails.valid;
  }

  updateDetails() {

    let isFormValid = this.validateFormData();

    if (isFormValid) {

      this.client = this.companyDetails.value;
      this.client.businessEntityType = JSON.stringify(this.businessEntities);

      this._spinnerService.show();
      let _url = environment.baseUrl + APP_URL.BUSINESS_UPDATE_CLIENT;

      this._registerService.submitCompanyData(_url, this.client).subscribe(async (res) => {

        this._spinnerService.hide();
        if (res.status === ServiceResponse.STATUS_SUCCESS) {

          swal.fire({
            text: 'Company details saved successsfully',
            icon: 'success',
            onClose: () => {
              this._router.navigate(['dashboard']);
            }
          });

          if (this.selectedFile && res.response && res.response.data && res.response.data.id) {
            // need to call this in loop as there might be multiple uploaded files, 
            // also need to check whether the file was changed 
            for (const property in this.selectedFile) {
              if (this.selectedFile[property]) {
                await this.saveAttachment(res.response.data.id, res.response.itemType, property);
              }
            }
          }

        } else {
          swal.fire({ text: res.error, icon: 'error' });
        }
      });
    }
  }

  addDocument(name: String) {

  }

  saveAttachment(itemId: Number, itemType, type: string = '') {

    return new Promise((resolve, reject) => {
      let formData = new FormData()
      formData.append('selectedFile', this.selectedFile[type]);
      formData.append('itemId', JSON.stringify(itemId));
      formData.append('itemType', itemType);
      formData.append('attachType', type.toUpperCase());
      //PAN, GST, CIN
      this._registerService.saveAttachment(formData).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });

    });
  }

  openApprovalPop() {

    swal.mixin({
      confirmButtonText: 'Next &rarr;',
      showCancelButton: true,
      progressSteps: ['1', '2']
    }).queue([
      {
        text: 'Please select what you want to do with the request',
        input: 'select',
        inputOptions: {
          approve: 'Approve',
          reject: 'Reject',
          callback: 'Send Back'
        },
        inputAttributes: {
          required: 'true',
        }
      },
      {
        text: 'Please enter a reason*',
        input: 'textarea',
        inputPlaceholder: 'Enter comment',
        inputAttributes: {
          autocapitalize: 'off',
          autocorrect: 'off',
          required: 'true'
        }
      },
    ]).then((result: any) => {

      if(result.value[0] == 'reject') {
        let isinact = this.companyDetails.value.isInActive;
        let isinactReason = this.companyDetails.value.inactivationReason;
        let isinactRemark = this.companyDetails.value.inactivationRemarks;
        if(isinact) {
          if ((isinactReason == 'null' || isinactReason == null || isinactReason == undefined) && (isinactRemark == 'null' || isinactRemark == null || isinactRemark == undefined)) {
            swal.fire({ text: 'Please Enter Inactivation Reason Remark', icon: 'error' });
            return;
          }
        } else {
          swal.fire({ text: 'Please Select Inactivation Checkbox Before Rejecting Request', icon: 'error' });
          return;
        }
      }

      const values = result.value;
      const params = {
        requestId: this.companyDetails.value.id,
        requestType: values[0],
        comment: values[1]
      }

      if (this._tableService.selRecord != null && this._tableService.selMenu && this._tableService.selMenu['owner'] == 'addclient-req') {
        params.requestId = this._tableService.selRecord['id'];
      }

      this._spinnerService.show();
      this._registerService.processRequest(params).subscribe((res) => {

        this._spinnerService.hide();
        if (res.status == ServiceResponse.STATUS_SUCCESS) {
          swal.fire({
            text: 'Request processed successsfully',
            icon: 'success',
            onClose: () => {
              this._router.navigate(['dashboard']);
            }
          });
        } else {
          swal.fire({
            text: res.error,
            showCloseButton: true,
          });
        }
      }, (err) => {

        this._spinnerService.hide();
        swal.fire({
          title: 'Something went wrong',
          showCloseButton: true
        }).then(() => {
          this._router.navigate(['dashboard']);
        })
      })
    })
  }

  onBeforeSubmit() {

    if (this.companyDetails.value.registrationStatus == "Under Approval") {
      this.openApprovalPop();
    } else {

      swal.fire({
        text: 'On submitting, a request for approval will be generated. Please enter comment',
        input: 'text',
        showCloseButton: true,

      }).then((result) => {

        if (result.value) {
          this.companyDetails.addControl("reqComment",new FormControl(result.value,[]))
          this.submitDetails();
        }
      })
    }
  }

  submitDetails() {

    let isFormValid = this.validateFormData();
    if (isFormValid) {

      this.client = this.companyDetails.value;
      this.client.businessEntityType = JSON.stringify(this.businessEntities);
      this._spinnerService.show();
      let _url = environment.baseUrl + APP_URL.BUSINESS_SUBMIT_CLIENT;

      this._registerService.submitCompanyData(_url, this.client).subscribe(async res => {
        this._spinnerService.hide();
        if (res.status === ServiceResponse.STATUS_SUCCESS) {

          swal.fire({
            text: 'Request generated successsfully',
            icon: 'success',
            onClose: () => {
              this._router.navigate(['dashboard']);
            }
          });
          if (this.selectedFile && res.response && res.response.data && res.response.data.id) {
            // need to call this in loop as there might be multiple uploaded files, 
            // also need to check whether the file was changed 
            for (const property in this.selectedFile) {
              if (this.selectedFile[property]) {
                await this.saveAttachment(res.response.data.id, res.response.itemType, property);
              }
            }
          }
        } else {
          swal.fire({ text: res.error, icon: 'error' });
        }
      }, (err) => {
        swal.fire({ text: 'Something went wrong.', icon: 'error' });
        this._spinnerService.hide();
      });
    }
  }

  backProcess() {
    this._location.back();
  }

  onClientAdminDetailChange() {

    this.companyDetails.get("clientAdmin").valueChanges.subscribe((val) => {
      if (this.isSameAsAdmin) {
        this.companyDetails.controls.requester.patchValue(val);
      }
    });
  }

  onCorrAddressDetailChange() {

    this.companyDetails.get('clientDetails').get('officeAddress').valueChanges.subscribe((val) => {
      if (this.isSameAsRegAdd) {
        this.companyDetails.get('clientDetails').get('corrAddress').patchValue(val);
      }
    });
  }

  onInActivationCange($event) {

    let isInActive = this.companyDetails.get('isInActive').value;
    this.setValidatorsForInActiveStatus(isInActive);
    this.updtRegStatusByInActive(this.isInActiveReq());

    this.InactivationMandatory = isInActive ? true : false;
  }

  setValidatorsForInActiveStatus(isInActive) {

    if (isInActive) {
      this.companyDetails.get("inactivationReason").setValidators([Validators.required]);
      this.companyDetails.get("inactivationRemarks").setValidators([Validators.required]);
    } else {
      this.companyDetails.get("inactivationReason").reset();
      this.companyDetails.get("inactivationReason").setValidators([]);
      this.companyDetails.get("inactivationReason").updateValueAndValidity();
      this.companyDetails.get("inactivationRemarks").reset();
      this.companyDetails.get("inactivationRemarks").setValidators([]);
      this.companyDetails.get("inactivationRemarks").updateValueAndValidity();
    }

    this.companyDetails.updateValueAndValidity();
  }

  isInActiveReq() {

    let regStatusArr = ['Draft', 'Under Validation', 'Sent Back for Validation', 'Active'];
    if (this.companyDetails.get('isInActive').value) {
      if (regStatusArr.indexOf(this.companyDetails.value.registrationStatus) > -1) {
        return true;
      }
      return false;
    }
    return false;
  }

  onValidatePanCard() {

  }

  moveToInvalidElement() {
    try {
      const firstElementWithError = this._elementRef.nativeElement.querySelector('form .form-input .ng-invalid');
      if (firstElementWithError && firstElementWithError != null) {
        firstElementWithError.scrollIntoView({ behavior: 'smooth' });
        firstElementWithError.focus();
      }
    } catch (err) { }
  }

  updtRegStatusByInActive(inActive) {
    if (inActive) {

      this.companyDetails.get("registrationStatus").setValue("InActive");

    } else {
      if (this.curRegStatus == "InActive") {
        if (this.companyDetails.get("isAccountActivated").value == true) {
          this.companyDetails.get("registrationStatus").setValue("Active");
        } else {
          this.companyDetails.get("registrationStatus").setValue("Draft");
        }
      } else {
        this.companyDetails.get("registrationStatus").setValue(this.curRegStatus);
      }
    }
  }
  checkboxValidator(minRequired = 1): ValidatorFn {
    return function validate(formGroup: FormGroup) {
      let checked = 0;
      Object.keys(formGroup.controls).forEach(key => {
        const control = formGroup.controls[key]
        if (control.value) {
          checked++
        }
      })
  
      if (checked < minRequired) {
        return {
          required: true,
        }
      }
  
      return null
    }
  }
  
}
