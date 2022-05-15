import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { LovFetcherService } from 'src/app/common/lov-fetcher/lov-fetcher.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { APP_URL } from 'src/app/common/app-urls/app-urls';
import { ServiceResponse } from 'src/app/common/service-response';
import swal from 'sweetalert2';
import { AppUser } from 'src/app/common/entity/user/app-user';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { ImageViewerComponent } from 'src/app/common/image-viewer/image-viewer.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserService } from 'src/app/common/user.service';
import { TableViewService } from 'src/app/app-widgets/table/table-view/table-view.service';
import { AppLayoutService } from 'src/app/app-layout/app-layout.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  userDetails: FormGroup;
  userProfile: FormGroup;
  user: AppUser;
  maxDate = new Date(new Date().setFullYear(new Date().getFullYear() - 18));
  username = '';

  fileDetails = {
    pan: { itemId: null, itemType: '', show: false, src: null },
    aadhaar: { itemId: null, itemType: '', show: false, src: null },
    profile: { itemId: null, itemType: '', show: false, src: null }
  };

  selectedFile: Object = {
    pan: null,
    aadhaar: null,
    profile: null
  };

  lovMetadata: object = {};
  currentStateLov: object = {};
  edit_mode: boolean = false;
  show_dob: boolean = true;
  //user data temp

  userRes;

  constructor(
    private _fb: FormBuilder,
    private _lovService: LovFetcherService,
    private _spinnerService: NgxSpinnerService,
    private _dialog: MatDialog,
    private _router: Router,
    private _tableService: TableViewService,
    private _userService: UserService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _layoutService: AppLayoutService
  ) { }

  ngOnInit(): void {

    this.getLovData();
    this.addFormFields();
    this.fetchUser();
  }

  ngOnDestroy(): void {
    this._tableService.unsubscribeTableData();
  }

  private getLovData() {

    this._spinnerService.show();
    let _url = environment.baseUrl + APP_URL.USER_LOV_REGISTRATION;

    this._lovService.getLovList(_url).subscribe(res => {

      this.getOrgList();

      if (res.status === ServiceResponse.STATUS_SUCCESS) {
        this.lovMetadata = res.response.data;
        this.currentStateLov = this.lovMetadata['currentStatus'];
        this.updateCurrentStatus(null);
      } else {
        swal.fire(res.error, 'failure');
      }
    });
  }

  fetchUser() {

    if (this._tableService.selRecord && this._tableService.selRecord['id']) {

      let _url = environment.baseUrl + APP_URL.USER_FETCH;
      let paramObj = {};
      paramObj['itemId'] = this._tableService.selRecord['id'];
      this.edit_mode = true;
      this._spinnerService.show();

      this._userService.fecthUser(_url, JSON.stringify(paramObj)).subscribe(res => {

        this._spinnerService.hide();
        if (res.status === ServiceResponse.STATUS_SUCCESS) {

          let data = res.response.data;
          this.patchFormValues(data, res.response.userProfile);
          this.setFileValues(data, res.response.itemType);
          this.userRes = res.response.data;
          this.fileDetails.profile.itemId = this.userRes.id;
          this.fileDetails.profile.itemType = res.response.itemType;
          this.loadImage('profile');

          if (this.userRes['currentState'] == 'Active') {
            this.show_dob = false;
          }

        } else {
          swal.fire(res.response.error, 'failure');
        }
      }, (err) => {
        this._spinnerService.hide();
      });

    }
  }
  handleDobChange(event) {
    let date: any = new Date(event).toString();
    if (date == 'invalid date' || date == 'Invalid Date') {
      this.show_dob = true;
    } else {
      this.show_dob = false;
    }
  }


  patchFormValues(data, userProfile) {

    let roleList = data.roleList.map(function (item) {
      return item.id;
    });

    let teamId = userProfile.team.id;
    let orgId = userProfile.team.organization.id;
    this.userDetails.patchValue(data);
    this.userDetails.get("roleList").setValue(roleList);
    this.userDetails.get("team").setValue(teamId);
    this.userDetails.get("organization").setValue(orgId);
    this.getTeamList(orgId);
    this.userDetails.get("grade").setValue(data.userDetails.grade);
    this.getRoleList(teamId);
    this.updateCurrentStatus(data);

    this.userDetails.get("userProfile").get("id").setValue(userProfile.id);
    this.userDetails.get("userProfile").get("emailAddress").setValue(userProfile.emailAddress);
  }

  getOrgList() {

    let _url = environment.baseUrl + APP_URL.USER_ORG_LIST;

    this._lovService.getLovList(_url).subscribe(res => {

      this._spinnerService.hide();
      if (res.status === ServiceResponse.STATUS_SUCCESS) {

        this.lovMetadata['orgList'] = res.response.data;
        if (res.response.selected && res.response.data && res.response.data[0]) {

          this.userDetails.get("organization").setValue(res.response.data[0].id);
          this.getTeamList(res.response.data[0].id);
        }

      } else {
        this.lovMetadata['orgList'] = [];
      }
    }, (err) => {
      this._spinnerService.hide();
    });
  }

  getTeamList(value) {

    this._spinnerService.show();
    let _url = environment.baseUrl + APP_URL.USER_TEAM_LIST + "?orgId=" + value;

    this._lovService.getLovList(_url).subscribe(res => {

      this._spinnerService.hide();
      if (res.status === ServiceResponse.STATUS_SUCCESS) {

        this.lovMetadata['teams'] = res.response.data;
      } else {
        this.lovMetadata['teams'] = [];
        swal.fire(res.error, 'failure');
      }
    });
  }

  getRoleList(value) {

    this._spinnerService.show();
    let _url = environment.baseUrl + APP_URL.USER_ROLE_LIST + "?teamId=" + value;

    this._lovService.getLovList(_url).subscribe(res => {

      this._spinnerService.hide();
      if (res.status === ServiceResponse.STATUS_SUCCESS) {
        this.lovMetadata['role'] = res.response.data;
      } else {
        this.lovMetadata['role'] = [];
        swal.fire(res.error, 'failure');
      }
    });
  }

  private addFormFields() {

    let userKycDetails = this._fb.group({
      id: ['', []],
      employeeId: ['', [Validators.required]],
      ctc: ['', [Validators.required, Validators.min(0.1)]],
      panNumber: ['', [Validators.pattern(/([A-Z]){5}([0-9]){4}([A-Z]){1}$/)]],
      aadhaarNumber: ['', [Validators.pattern(/^\d{12}$/)]],
      isPanValid: ['', []],
      isAadharValid: ['', []],
      panImage: ['', [RxwebValidators.extension({ extensions: ['jpeg', 'jpg', 'png', 'gif', 'bmp'] })]],
      aadharImage: ['', [RxwebValidators.extension({ extensions: ['jpeg', 'jpg', 'png', 'gif', 'bmp'] })]],

    });

    this.userProfile = this._fb.group({ id: ['', []], emailAddress: ['', [Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]] });

    this.userDetails = this._fb.group({
      id: ['', []],
      firstName: ['', [Validators.required, Validators.pattern(/^[a-z ,.'-]+$/i)]],
      userImage: ['', RxwebValidators.extension({ extensions: ['jpeg', 'jpg', 'png', 'gif', 'bmp'] })],
      lastName: ['', [Validators.required, Validators.pattern(/^[a-z ,.'-]+$/i)]],
      mobileNo: ['', [Validators.required, Validators.pattern(/^(7|8|9)\d{9}$/)]],
      birthDate: [false, [Validators.required]],
      username: ['', []],
      designation: ['', [Validators.required]],
      grade: ['', [Validators.required]],
      organization: ['', [Validators.required]],
      team: ['', [Validators.required]],
      roleList: ['', [Validators.required]],
      currentState: ['', []],
      status: ['', []],
      userDetails: userKycDetails,
      userProfile: this.userProfile
    });

  }

  validatePanCard() {

  }

  validateAadharCard() {

  }

  validaateForm() {
    let isValid = this.userDetails.valid;

    if (!this.userDetails.valid) {

      let birthDateErr = this.userDetails.get('birthDate').errors;
      if (this.userDetails.get('birthDate').value) {
        this.userDetails.get('birthDate').setErrors(null);
        isValid = this.userDetails.valid;
        console.log();
  }

      this.userDetails.get('birthDate').setErrors(birthDateErr);
    }
 
    return isValid;
  }

  submitUserDetails() {

    let formValid = this.validaateForm();
    if (!formValid) {
      this.showValidationMsg(this.userDetails); // to show error messages
      return false;
    }

    swal.fire({
      title: "Are you sure?",
      text: "You want to submit this user.",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      showCloseButton: true
    }).then((data) => {

      if (data.isConfirmed) {

        this.user = this.userDetails.value;
        this._spinnerService.show();
        let _url = environment.baseUrl + APP_URL.USER_SUBMIT;
        let params = {};
        params['username'] = this.userRes.username;
        params['emailAddress'] = this.userDetails.value["userProfile"]["emailAddress"];

        this._userService.submitUserData(_url, params).subscribe(async (res) => {

          this._spinnerService.hide();
          if (res.status === ServiceResponse.STATUS_SUCCESS) {

            swal.fire({
              text: 'An email will be sent once the account is activated',
              icon: 'success',
              onClose: () => {
                this._router.navigate(['user-list']);
              }
            });
          } else {
            swal.fire({ text: 'Something went wrong.', icon: 'error' });
          }

        }, (err) => {
          this._spinnerService.hide();
        })
      }
    })
  }

  openImageModal(type) {

    if (this.fileDetails[type]['src']) {
      let title = 'Image Viewer';
      this.openImagePop(title, this.fileDetails[type]['src']);
    } else {
      this.loadImage(type);
    }
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

  loadImage(type) {

    this._spinnerService.show();
    this._userService.getAttachment({ itemId: this.fileDetails[type]['itemId'], itemType: this.fileDetails[type]['itemType'], attachType: type.toUpperCase() }).subscribe((data) => {

      this._spinnerService.hide();
      if (data.status == ServiceResponse.STATUS_SUCCESS && data.response && data.response.attachmentData) {

        let imageData = data.response.attachmentData;
        this.fileDetails[type]['src'] = "data:image/jpeg;base64," + imageData.data;
        if (type != 'profile') {
          this.openImagePop('Image Viewer', this.fileDetails[type]['src']);
        }
      }
    }, (err) => {
      this._spinnerService.hide();
    })
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
    }
  }

  backProcess() {
    this._router.navigate(['user-list']);
  }

  saveUser() {

    let formValid = this.validaateForm();
    if (!formValid) {
      this.showValidationMsg(this.userDetails); // to show error messages
      return false;
    }

    this.user = this.userDetails.value;
    this._spinnerService.show();
    let _url = environment.baseUrl + APP_URL.USER_REGISTER;

    let params = {};
    params['data'] = this.user;
    params['team'] = this.user.team;
    params['role'] = this.user.roleList;
    params['data']['userDetails']['grade'] = this.user.grade;
    delete params['data']['team'];
    delete params['data']['roleList'];

    let dateObj = this.user.birthDate;
    params['data']['birthDate'] = this.getFormattedDate(this.user.birthDate);
    params["userProfile"] = this.userDetails.value["userProfile"];

    this._userService.submitUserData(_url, params).subscribe(async (res) => {

      this._spinnerService.hide();
      this.userRes = res.response.data;

      if (res.status === ServiceResponse.STATUS_SUCCESS) {

        swal.fire({
          text: 'User Saved successfully.',
          icon: 'success',
          onClose: () => {
          }
        });

        if (this.selectedFile && res.response && res.response.data && res.response.data.id) {

          for (const property in this.selectedFile) {
            if (this.selectedFile[property]) {
              await this.saveAttachment(res.response.data.id, res.response.itemType, property);
            }
          }

          this.patchFormValues(res.response.data, res.response.profile);
        }
      } else {
        this.userDetails.get("birthDate").setValue(dateObj);
        swal.fire({ text: res.error, icon: 'error' });
      }

    }, (err) => {
      this.userDetails.get("birthDate").setValue(dateObj);
      this._spinnerService.hide();
    })
  }

  onBeforeSubmit() {

  }

  saveAttachment(itemId: Number, itemType, type: string = '') {

    return new Promise((resolve, reject) => {

      let formData = new FormData()
      formData.append('selectedFile', this.selectedFile[type]);
      formData.append('itemId', JSON.stringify(itemId));
      formData.append('itemType', itemType);
      formData.append('attachType', type.toUpperCase());
      //PAN, GST, CIN
      this._userService.saveAttachment(formData).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });

    });
  }

  getFormattedDate(dateObj = new Date()) {

    if (dateObj instanceof Date) {
      var dd = String(dateObj.getDate()).padStart(2, '0');
      var mm = String(dateObj.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = dateObj.getFullYear();

      return yyyy + '-' + mm + '-' + dd;
    } else {
      return dateObj;
    }
  }

  setFileValues(data, itemType) {

    if (data.userDetails.panNumber) {
      this.fileDetails.pan = { itemId: data.id, itemType: itemType, show: true, src: null };
    }
    if (data.userDetails.aadhaarNumber) {
      this.fileDetails.aadhaar = { itemId: data.id, itemType: itemType, show: true, src: null };
    }

  }

  updateCurrentStatus(user) {

    this.lovMetadata['currentStatus'] = JSON.parse(JSON.stringify(this.currentStateLov));
    if (!(this.lovMetadata['currentStatus'] instanceof Array)) {
      return;
    }

    if (user != null) {

      let currentState = user.currentState;
      if (currentState != null && currentState == 'Sent for Validation') {

        this.lovMetadata['currentStatus'] = this.lovMetadata['currentStatus'].filter((item) => {

          if (item.itemName == "Sent for Validation") {
            return true;
          } else {
            return false;
          }
        });
      }
      this._changeDetectorRef.detectChanges();

    } else {

      this.lovMetadata['currentStatus'] = this.lovMetadata['currentStatus'].filter((item) => {

        if (item.itemName == 'Active' || item.itemName == 'Draft') {
          return true;
        } else {
          return false;
        }
      });

      this.userDetails.get("currentState").setValue(this.lovMetadata['currentStatus'][0]['itemName']);
    }
  }

  showValidationMsg(formGroup: FormGroup) {
    for (const key in formGroup.controls) {
      if (formGroup.controls.hasOwnProperty(key)) {
        const control: FormControl = <FormControl>formGroup.controls[key];
        if (Object.keys(control).includes('controls')) {
          const formGroupChild: FormGroup = <FormGroup>formGroup.controls[key];
          this.showValidationMsg(formGroupChild);
        }
        control.markAsTouched();
      }
    }
  }
}
