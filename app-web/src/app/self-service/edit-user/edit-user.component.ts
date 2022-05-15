import { DOCUMENT, Location } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { NgxSpinnerService } from 'ngx-spinner';
import { TableViewService } from 'src/app/app-widgets/table/table-view/table-view.service';
import { APP_URL } from 'src/app/common/app-urls/app-urls';
import { AppUser } from 'src/app/common/entity/user/app-user';
import { ImageViewerComponent } from 'src/app/common/image-viewer/image-viewer.component';
import { LovFetcherService } from 'src/app/common/lov-fetcher/lov-fetcher.service';
import { ServiceResponse } from 'src/app/common/service-response';
import { UserService } from 'src/app/common/user.service';
import { environment } from 'src/environments/environment';
import swal from 'sweetalert2';


@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  userFromGrp: FormGroup;
  user: AppUser;
  roles: string = "";
  isFormEdit: Boolean = false;

  maxDate = new Date(new Date().setFullYear(new Date().getFullYear() - 18));

  itemType: string;

  fileDetails = {
    pan: { itemId: null, itemType: '', show: false, src: null },
    aadhaar: { itemId: null, itemType: '', show: false, src: null },
    profile: { itemId: null, itemType: '', show: false, src: null }
  };

  selectedFile: Object = {
    pan: null,
    aadhar: null
  };

  lovMetadata: object = {};
  edit_mode: boolean = false;

  constructor(
    private _fb: FormBuilder,
    private _lovService: LovFetcherService,
    private _spinnerService: NgxSpinnerService,
    private _dialog: MatDialog,
    private _tableService: TableViewService,
    private _userService: UserService,
    private _location: Location,
    @Inject(DOCUMENT) private document
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
      if (res.status === ServiceResponse.STATUS_SUCCESS) {
        this.lovMetadata = res.response.data;
        if (this.lovMetadata && this.lovMetadata['currentStatus']) {
          this.lovMetadata['currentStatus'] = this.lovMetadata['currentStatus'].filter((item) => {
            if (item.itemName == 'Active' || item.itemName == 'Draft') {
              return true;
            } else {
              return false;
            }
          })
        }
      } else {
        swal.fire(res.error, 'failure');
      }
    });
  }

  fetchUser() {
    let _url = environment.baseUrl + APP_URL.USER_CURRENT_FETCH;
    let paramObj = {};

    this._spinnerService.show();
    this._userService.fecthUser(_url, JSON.stringify(paramObj)).subscribe(res => {
      this._spinnerService.hide();
      if (res.status === ServiceResponse.STATUS_SUCCESS) {
        this.patchFormValues(res.response.data, res.response.userProfile);
        this.itemType = res.response.itemType;
        this.setFileValues(res.response.data, this.itemType);
        this.updateSrcImage("profile");
      } else {
        swal.fire(res.response.error, 'failure');
      }
    }, (err) => {
      this._spinnerService.hide();
    });

  }
  patchFormValues(data, userProfile) {
    this.userFromGrp.patchValue(data);
    this.userFromGrp.get("team").setValue(userProfile?.team?.name);
    this.userFromGrp.get("organization").setValue(userProfile?.team?.organization?.name);
    this.userFromGrp.get("userProfile").patchValue(userProfile);
    this.roles = data.roleList.map(e => e.name).join(", ");
  }

  private addFormFields() {
    let userKycDetails = this._fb.group({
      employeeId: ['', []],
      ctc: ['', []],
      panNumber: ['', []],
      aadhaarNumber: ['', []],
      panImage: ['', []],
      aadharImage: ['', []],
      grade: ['', []],
    });
    let userProfile = this._fb.group({
      id: ['', []],
      emailAddress: ['', [Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
    });
    this.userFromGrp = this._fb.group({
      id: ['', []],
      firstName: ['', []],
      lastName: ['', []],
      mobileNo: ['', [Validators.required, Validators.pattern(/^(7|8|9)\d{9}$/)]],
      birthDate: [false, []],
      designation: ['', []],
      organization: ['', []],
      team: ['', []],
      currentState: ['', []],
      profileImage: ['', [RxwebValidators.extension({ extensions: ['jpeg', 'jpg', 'png', 'gif', 'bmp'] })]],
      userDetails: userKycDetails,
      userProfile: userProfile
    });

  }

  validateForm() {
    return this.userFromGrp.valid;
  }

  validatePanCard() {

  }

  validateAadharCard() {

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
        this.openImagePop('Image Viewer', this.fileDetails[type]['src']);
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
    debugger
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
    this._location.back();
  }

  saveUser() {
    let formValid = this.validateForm();
    if (!formValid) {
      return false;
    }

    this.user = this.userFromGrp.value;
    this._spinnerService.show();
    let _url = environment.baseUrl + APP_URL.USER_UPDATE;
    let reqData = this.userFromGrp.value;

    reqData['birthDate'] = this.getFormattedDate(reqData['birthDate']);
    reqData['userProfileDto'] = this.userFromGrp.get("userProfile").value;
    this._userService.submitUserData(_url, reqData).subscribe(async (res) => {

      this._spinnerService.hide();

      if (res.status === ServiceResponse.STATUS_SUCCESS) {
        swal.fire({
          text: 'Data saved successfully',
          icon: 'success',
          onClose: () => {
            this._location.back();
          }
        });
        if (this.selectedFile && res.response && res.response.data && res.response.data.id) {

          for (const property in this.selectedFile) {
            if (this.selectedFile[property]) {
              await this.saveAttachment(res.response.data.id, res.response.itemType, property);
            }
          }
          this.document.location.reload();
        }
      } else {
        swal.fire({ text: res.error, icon: 'error' },);
      }

    }, (err) => {
      this._spinnerService.hide();
    })
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
    this.fileDetails.profile = { itemId: data.id, itemType: itemType, show: true, src: null };
  }

  updateSrcImage(name) {
    this._userService.getAttachment({ itemId: this.fileDetails[name]["itemId"], itemType: this.fileDetails[name]["itemType"], attachType: name.toUpperCase() }).subscribe((data) => {
      this._spinnerService.hide();
      if (data.status == ServiceResponse.STATUS_SUCCESS && data.response && data.response.attachmentData) {
        let imageData = data.response.attachmentData;
        this.fileDetails[name]['src'] = "data:image/jpeg;base64," + imageData.data;
      }
    }, (err) => {
      this._spinnerService.hide();
    })
  }
  onEdit() {
    this.isFormEdit = !this.isFormEdit;
  }

  submitUser() {
    this.saveUser();
  }
}
