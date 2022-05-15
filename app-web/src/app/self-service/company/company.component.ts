import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, Renderer2 } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { NgxSpinnerService } from 'ngx-spinner';
import { APP_URL } from 'src/app/common/app-urls/app-urls';
import { Client } from 'src/app/common/entity/client/client';
import { ImageViewerComponent } from 'src/app/common/image-viewer/image-viewer.component';
import { LovFetcherService } from 'src/app/common/lov-fetcher/lov-fetcher.service';
import { RegisterService } from 'src/app/common/register-service/register.service';
import { ServiceResponse } from 'src/app/common/service-response';
import { environment } from 'src/environments/environment';
import swal from 'sweetalert2';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
  
  companyDetails: FormGroup;
  client: Client;
  comment: string;
  curRegStatus: string;
  profileDetails: any;
  addressDetails: string = '';
  status = [];
  isProfileEdit: boolean = false;
  isFormEdit: boolean = false;
  itemType: string = '';
  insuranceCategory: any;
  fileDetails = {
    pan: { itemId: null, itemType: '', show: false, src: null },
    cin: { itemId: null, itemType: '', show: false, src: null },
    gst: { itemId: null, itemType: '', show: false, src: null },
    profile: { itemId: null, itemType: '', show: false, src: null }
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
  businessEntities;
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

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private _fb: FormBuilder,
    private _lovService: LovFetcherService,
    private _spinnerService: NgxSpinnerService,
    private _registerService: RegisterService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.fetchCompPrflData();
  }

  fetchCompPrflData() {
    this.entitiesChecked = {};
    this.legalEntityDrodown = [];
    this.inactivationReasons = [];
    this.businessEntityTypeCheckBox = [];
    this.businessEntityObj = {};
    this.categoryRadioButtons = [];
    this.industryDropdown = [];
    this.noOfEmployeesDropdown = [];
    this.countries = [];
    this.states = [];
    this.cities = [];
    this.pincodes = [];

    this.getLovData();
    this.addFormFields();
  }

  private addFormFields() {

    let clientDetails;

    clientDetails = this._fb.group({
      id: ['', []],
      employeeCount: ['', []],
      panNumber: ['', [Validators.required, Validators.pattern(/([A-Z]){5}([0-9]){4}([A-Z]){1}$/)]],
      panValid: [{ value: true, disabled: true }, []],
      cinNumber: ['', [Validators.required]],
      cinValid: [{ value: true, disabled: true }, []],
      gstNumber: ['', [Validators.required, Validators.pattern(/\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/)]],
      sameAsRegOff: ['', []],
      panImage: ['', [RxwebValidators.extension({ extensions: ['jpeg', 'jpg', 'png'] })]],
      cinImage: ['', [RxwebValidators.extension({ extensions: ['jpeg', 'jpg', 'png'] })]],
      gstImage: ['', [RxwebValidators.extension({ extensions: ['jpeg', 'jpg', 'png'] })]],
      yearOfInc: ['', [Validators.required, Validators.pattern(/^[12][0-9]{3}$/)]],
      irdaLicenseNum: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]$/)]],
      numOfYrsInBiz: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      numOfYrsInGrpBiz: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      capital: ['', [Validators.required, Validators.pattern(/^[0-9]\d*(\.\d+)?$/)]],
      solvencyRatio: ['', [Validators.required, Validators.pattern(/(^100(\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,2})?$)/)]],
      stlmtRatio: ['', [Validators.required, Validators.pattern(/(^100(\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,2})?$)/)]],
      assetUnderMgmt: ['', [Validators.required, Validators.pattern(/^[0-9]\d*(\.\d+)?$/)]],
      sector: ['', Validators.required]
    });


    this.companyDetails = this._fb.group({
      id: ['', []],
      companyName: ['', [Validators.required]],
      legalEntity: ['', [Validators.required]],
      // businessEntityType: [null, [Validators.required]],
      insuranceCategory: [null, [Validators.required]],
      industryType: ['', [Validators.required]],
      source: ['', []],
      registrationStatus: ['', []],
      isInActive: [false, []],
      inactivationReason: ['', []],
      inactivationRemarks: ['', []],
      clientDetails: clientDetails,
      rrbCheckBox: ['', []],
      currentState: ['', []],
      isAccountActivated: [false, []]
    });
  }

  onTabChanged(event) {

  }

  private getLovData() {

    this._spinnerService.show();
    let _url = environment.baseUrl + APP_URL.BUSINESS_LOV_REGISTRATION;
    this._lovService.getLovList(_url).subscribe(res => {
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

        this.companyDetails.addControl('businessEntityType', this.createCheckbox(this.businessEntityTypeCheckBox));
        this.fetchClient();
        this.categoryRadioButtons = data.insuranceCategory;
        this.countries = data.country;
        this.cities = data.city;
        this.states = data.state;
        this.pincodes = data.pincode;
      } else {
        swal.fire(res.error, 'failure');
        this._spinnerService.hide();
      }
    }, () => {
      this._spinnerService.hide();
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
    return new FormArray(arr, [this.bizEntityTypeValid()]);
  }


  private patchFormValues(client: Client) {
    if (!this.businessEntities) {
      this.businessEntities = client.businessEntityType ? JSON.parse(client.businessEntityType) : [];
    }
    let checkBoxValues = [];
    this.businessEntityTypeCheckBox.forEach(element => {
      let value = false;
      //this.entitiesChecked[element.itemName] = false;
      let index = this.businessEntities.findIndex(x => x === element.id);

      if ((element.itemName in this.entitiesChecked)) {
        value = this.entitiesChecked[element.itemName];
      }
      else if (index != -1) {
        value = true;
        this.businessEntityTypeCheckBox[index]['checked'] = true;
      };
      this.entitiesChecked[element.itemName] = value;
      checkBoxValues.push(value);
    });
    delete client.businessEntityType;
    this.companyDetails.controls.businessEntityType.setValue(checkBoxValues);
    this.companyDetails.patchValue(client);
    this.curRegStatus = this.companyDetails.get("registrationStatus").value;

    // this.setValidatorsForInActiveStatus(this.companyDetails.get("isInActive").value);
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

  private updateCompanyForm(res) {
    let data = res.response.data;
    this.setProfileDetails(data);
    this.comment = res.response.comment;
    this.patchFormValues(data);
    this.itemType = res.response.itemType;
    this.setFileValues(data, this.itemType);

    this.addRemoveFields(false);



    //loading profile pic
    this._registerService.getAttachment({ itemId: this.profileDetails.id, itemType: this.itemType, attachType: 'PROFILE' }).subscribe((data) => {
      this._spinnerService.hide();
      if (data.status == ServiceResponse.STATUS_SUCCESS && data.response && data.response.attachmentData) {
        let imageData = data.response.attachmentData;
        this.fileDetails['profile']['src'] = "data:image/jpeg;base64," + imageData.data;
        this.fileDetails['profile']['itemId'] = this.profileDetails.id;
        this.fileDetails['profile']['itemType'] = this.itemType;
        this.fileDetails['profile']['show'] = true;
      }
    }, (err) => {
      this._spinnerService.hide();
    })
  }
  private fetchClient() {

    let _url = environment.baseUrl + APP_URL.BUSINESS_FETCH_CURRENT_CLIENT;

    this._spinnerService.show();
    this._registerService.fetchClient(_url).subscribe(res => {

      this._spinnerService.hide();
      if (res.status === ServiceResponse.STATUS_SUCCESS) {
        this.updateCompanyForm(res);
      } else {
        swal.fire(res.response.error, 'failure');
        this._spinnerService.hide();
      }
    }, () => {
      this._spinnerService.hide();
    });
  }
  setProfileDetails(data) {
    this.profileDetails = data;
    //Setting lov data
    let businessEntities = JSON.parse(data.businessEntityType);
    this.profileDetails['businessEntName'] = [];
    businessEntities.forEach(element => {
      this.profileDetails['businessEntName'].push(this.businessEntityObj[element]);
    });

    if (this.profileDetails.insuranceCategory) {
      let index = this.categoryRadioButtons.findIndex(x => x.id === this.profileDetails.insuranceCategory);
      this.insuranceCategory = this.profileDetails.insuranceCategory;
      this.profileDetails['categoryName'] = this.categoryRadioButtons[index].itemName;
    }

    let legalIndex = this.legalEntityDrodown.findIndex(x => x.id === this.profileDetails.legalEntity);
    this.profileDetails['legalEntName'] = this.legalEntityDrodown[legalIndex].itemName;

    if (this.profileDetails?.clientDetails?.employeeCount) {
      let emplIndex = this.noOfEmployeesDropdown.findIndex(x => x.id === this.profileDetails?.clientDetails?.employeeCount);
      this.profileDetails['noOfEmpName'] = this.noOfEmployeesDropdown[emplIndex].itemName;
    }
    let stateIndex = this.states.findIndex(x => x.id == this.profileDetails.clientDetails?.officeAddress?.state);
    this.profileDetails['stateName'] = this.states[stateIndex].itemName;
    let cityIndex = this.cities.findIndex(x => x.id == this.profileDetails.clientDetails?.officeAddress?.city);
    this.profileDetails['cityName'] = this.cities[cityIndex].itemName;
    let pinCodeIndex = this.pincodes.findIndex(x => x.id == this.profileDetails.clientDetails?.officeAddress?.pincode);
    this.profileDetails['pincodeName'] = this.pincodes[pinCodeIndex].itemName;

    if (this.profileDetails.industryType) {
      let industryIndex = this.industryDropdown.findIndex(x => x.id == this.profileDetails.industryType);
      this.profileDetails['industryName'] = this.industryDropdown[industryIndex].itemName;
    }
  }
  onSelImage(files, name) {
    if (files.length === 0)
      return;

    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    let fsize = Math.round((files[0].size / 1024));
    if (fsize > 2048) {
      swal.fire({ text: 'Please select a file less than 2mb', icon: 'error' });
      return;
    }
    this.selectedFile[name] = files[0];
    var reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.fileDetails[name]['src'] = reader.result;
      this.fileDetails[name]['show'] = true;
      this.saveAttachment(this.profileDetails.id, this.itemType, name).then((response: any) => {
        if (response.status === ServiceResponse.STATUS_SUCCESS) {
          this._snackBar.open(name + " updated successfully.", "Dismiss", {
            duration: 2000,
          });
        } else {
          this._snackBar.open("Something went wrong.", "Dismiss", {
            duration: 2000,
          });
        }

      }, (err) => {
        this._snackBar.open("Something went wrong.", "Dismiss", {
          duration: 2000,
        });
      })
    }
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

  addRemoveFields(isFetchClient = true) {

    if (!isFetchClient) {
      if (!this.entitiesChecked['Insurance Buyer']) {
        this.companyDetails.removeControl('industryType');
        let clientForm: any = this.companyDetails.get('clientDetails');
        clientForm.removeControl('employeeCount');
      }
      if (!this.entitiesChecked['Insurance Company']) {
        this.companyDetails.removeControl('insuranceCategory');
      }
    } else {
      if (this.entitiesChecked['Insurance Buyer']) {
        this.companyDetails.addControl('industryType', new FormControl('', [Validators.required]));
        this.companyDetails.updateValueAndValidity();
        let clientForm: any = this.companyDetails.get('clientDetails');
        clientForm.addControl('employeeCount', new FormControl('', [Validators.required]))
      } else {
        this.companyDetails.removeControl('industryType');
        let clientForm: any = this.companyDetails.get('clientDetails');
        clientForm.removeControl('employeeCount');
      }
      if (this.entitiesChecked['Insurance Company']) {
        this.companyDetails.addControl('insuranceCategory', new FormControl(null, [Validators.required]));
      } else {
        this.companyDetails.removeControl('insuranceCategory');
      }
    }
    let clientDetails: any = this.companyDetails.get('clientDetails');
    if (this.entitiesChecked['Insurance Company']) {
      clientDetails.addControl('yearOfInc', new FormControl('', [Validators.required, Validators.pattern(/^[12][0-9]{3}$/)]));
      clientDetails.addControl('irdaLicenseNum', new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{3}$/)]));
      clientDetails.addControl('numOfYrsInBiz', new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]));
      clientDetails.addControl('numOfYrsInGrpBiz', new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]));
      clientDetails.addControl('capital', new FormControl('', [Validators.required, Validators.pattern(/^[0-9]\d*(\.\d+)?$/)]));
      clientDetails.addControl('solvencyRatio', new FormControl('', [Validators.required, Validators.pattern(/(^100(\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,2})?$)/)]));
      clientDetails.addControl('stlmtRatio', new FormControl('', [Validators.required, Validators.pattern(/(^100(\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,2})?$)/)]));
      clientDetails.addControl('assetUnderMgmt', new FormControl('', [Validators.required, Validators.pattern(/^[0-9]\d*(\.\d+)?$/)]));
      clientDetails.addControl('sector', new FormControl('', [Validators.required]));

      if (isFetchClient) {
        this.fetchClient();
      }
    } else {
      clientDetails.removeControl('yearOfInc');
      clientDetails.removeControl('irdaLicenseNum');
      clientDetails.removeControl('numOfYrsInBiz');
      clientDetails.removeControl('numOfYrsInGrpBiz');
      clientDetails.removeControl('capital');
      clientDetails.removeControl('solvencyRatio');
      clientDetails.removeControl('stlmtRatio');
      clientDetails.removeControl('assetUnderMgmt');
      clientDetails.removeControl('sector');
    }

  }

  validateFormData() {
    return this.companyDetails.valid;
  }

  updateDetails() {

    let isFormValid = this.validateFormData();
    if (isFormValid) {
      this.client = this.companyDetails.value;
      this.client.businessEntityType = JSON.stringify(this.businessEntities);
      this._spinnerService.show();
      let _url = environment.baseUrl + APP_URL.BUSINESS_UPDATE_CURRENT_CLIENT;
      this._registerService.submitCompanyData(_url, this.client).subscribe(async (res) => {

        this._spinnerService.hide();
        if (res.status === ServiceResponse.STATUS_SUCCESS) {

          swal.fire({
            text: 'Company details saved successsfully',
            icon: 'success',
            onClose: () => {
              this.updateCompanyForm(res);
            }
          });
        } else {
          swal.fire({ text: res.error, icon: 'error' });
        }
      })

    }
  }

  backProcess() {

  }

  onProfileEdit() {
    this.isProfileEdit = true;
    this.isFormEdit = true;
  }

  onProfileCancel() {
    this.isProfileEdit = false;
    this.isFormEdit = false;
    this.document.location.reload();
  }

  bizEntityTypeValid(): ValidatorFn {
    return (formArray: FormArray) => {
      let valid: boolean = false;
      for (let control of formArray.controls) {
        if (control.value == true) {
          valid = true;
          break;
        }
      }

      return valid ? null : { error: 'Please select atleast one item.' }
    }
  }

}
