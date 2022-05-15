import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppLayoutService } from 'src/app/app-layout/app-layout.service';
import { TableViewService } from 'src/app/app-widgets/table/table-view/table-view.service';
import { APP_URL } from 'src/app/common/app-urls/app-urls';
import { LovFetcherService } from 'src/app/common/lov-fetcher/lov-fetcher.service';
import { RegisterService } from 'src/app/common/register-service/register.service';
import { ServiceResponse } from 'src/app/common/service-response';
import { environment } from 'src/environments/environment';
import swal from 'sweetalert2';

@Component({
  selector: 'app-add-policy',
  templateUrl: './add-policy.component.html',
  styleUrls: ['./add-policy.component.css']
})
export class AddPolicyComponent implements OnInit {

  policyDetails: FormGroup;
  lovDataObj: object = {};
  nomineesList = [];
  orgName = '';
  edit_type: string = '';
  readonly: boolean; // change value to true when view operation is performed

  constructor(
    private _fb: FormBuilder,
    private _spinnerService: NgxSpinnerService,
    private _router: Router,
    private _registerService: RegisterService,
    private _location: Location,
    private _lovService: LovFetcherService,
    private _layoutService: AppLayoutService,
    private _tableService: TableViewService
  ) {

    let states = this._router.getCurrentNavigation();
    if (states && states.extras && states.extras.state) {
      this.edit_type = states.extras.state['policySource'];
      this.readonly = states.extras.state['readonly'];
    }
  }

  ngOnInit(): void {

    this.addFormFields();
    this._spinnerService.show();
    Promise.all([this.getLovData(), this.getOrgList(), this.getInsuranceCompList()]).then((data) => {

      this._spinnerService.hide();
      if (this._tableService.selRecord && this._tableService.selRecord['id']) {
        this.fetchPolicy(this._tableService.selRecord['id']);
      }
    }, () => {
      this._spinnerService.hide();
    });
  }

  ngOnDestroy(): void {
    this._tableService.selRecord = null;
  }

  private addFormFields() {

    const orgDetails = this._fb.group({
      id: ['', []],
      employeeCount: ['', [Validators.required]],
      source: ['Third Party', [Validators.required]],
      policyRenewalDate: [null, [Validators.required]]
    });

    const userDetails = this._fb.group({
      id: ['', []],
      nomineeLastName: [''],
      nomineeFirstName: [''],
    });

    this.policyDetails = this._fb.group({
      id: ['', []],
      policyNum: [null, [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')]],
      policyType: ['', [Validators.required]],
      clientId: ['', [Validators.required]],
      companyName: [{ value: this.orgName, disabled: true }, []],
      policyStatus: [''],
      policyTerm: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      policyIssueDate: ['', [Validators.required]],
      riskComncDate: ['', [Validators.required]],
      nextPremiumPayDate: [false, [Validators.required]],
      isPersonal: [false, []],
      orgPolicy: orgDetails,
      userPolicy: userDetails
    });

    let roleList = this._layoutService.user ? this._layoutService.user['roleList'] : [];
    let index = roleList.findIndex(o => o.name === "GroupOwner");

    if (index != -1) {
      this.addRemoveFields(true);
    } else {
      this.addRemoveFields(false);
    }
  }

  addRemoveFields(check: boolean) {

    let orgForm: any = this.policyDetails.get('orgPolicy');

    orgForm.addControl('id', new FormControl('',));
    orgForm.addControl('employeeCount', new FormControl('', Validators.required));
    orgForm.addControl('source', new FormControl('Third Party', Validators.required));
    orgForm.addControl('policyRenewalDate', new FormControl('', Validators.required));
  }

  getLovData() {

    return new Promise((resolve) => {

      let _url = environment.baseUrl + APP_URL.POLICY_LOV_REGISTRATION;
      this._lovService.getLovList(_url).subscribe(res => {

        if (res.status === ServiceResponse.STATUS_SUCCESS) {

          let data = res.response.data;
          this.lovDataObj['policyType'] = data.policyType;
          this.lovDataObj['policySource'] = data.policySource;
          this.lovDataObj['policyStatus'] = data.policyStatus;
          let orgForm = this.policyDetails.get('orgPolicy');

          if (orgForm.get('source')) {
            orgForm.get('source').setValue('Third Party');
          }
        } else {

          swal.fire(res.error, 'failure');
        }
        resolve(true);
      }, () => {
        resolve(false);
      });
    })
  }

  getOrgList() {

    return new Promise((resolve) => {

      let _url = environment.baseUrl + APP_URL.USER_ORG_LIST;
      this._lovService.getLovList(_url).subscribe(res => {

        this._spinnerService.hide();

        if (res.status === ServiceResponse.STATUS_SUCCESS) {

          this.lovDataObj['orgList'] = res.response.data;
          this.orgName = res.response.data[0].name;
          if (this.policyDetails.controls.companyName) {
            this.policyDetails.controls.companyName.setValue(this.orgName);
          }
        } else {
          this.lovDataObj['orgList'] = [];
        }
        resolve(true);
      }, (err) => {
        resolve(false);
      });
    })
  }

  getInsuranceCompList() {

    return new Promise((resolve) => {

      let _url = environment.baseUrl + APP_URL.INSURANCE_COMPANIES_LIST;
      this._lovService.getLovList(_url).subscribe(res => {

        this._spinnerService.hide();
        if (res.status === ServiceResponse.STATUS_SUCCESS) {
          this.lovDataObj['insCompList'] = res.response.data;

        } else {
          this.lovDataObj['insCompList'] = [];
        }

        resolve(true);

      }, (err) => {
        resolve(false);
      });
    })
  }

  validateForm() {
    return this.policyDetails.valid;
  }

  fetchPolicy(id) {

    this._spinnerService.show();
    let _url = environment.baseUrl + APP_URL.FETCH_POLICY;
    let paramObj = {};
    paramObj['itemId'] = id;

    this._registerService.fetchClient(_url, JSON.stringify(paramObj)).subscribe(res => {

      if (res.status === ServiceResponse.STATUS_SUCCESS) {

        let data = Object.assign({}, res.response.data);
        if (data['userPolicy'] == null) {
          data['userPolicy'] = {};
        }
        if (data['orgPolicy'] == null) {
          data['orgPolicy'] = {};
        }
        if (data['isPersonal'] == null) {
          data['isPersonal'] = false;
        }

        if (data.orgPolicy && data.orgPolicy.source) {
          data.orgPolicy.source = parseInt(data.orgPolicy.source);
        }

        this.nomineesList = res.response.nominees;

        this.setFormValues(data);
        this._spinnerService.hide();

      } else {
        swal.fire(res.response.error, 'failure');
      }
    }, () => {
      this._spinnerService.hide();
    });
  }

  setFormValues(obj) {

    this.policyDetails.get('id').setValue(obj.id);
    this.policyDetails.get('policyNum').setValue(obj.policyNum);
    this.policyDetails.get('policyType').setValue(obj.policyType);
    this.policyDetails.get('policyStatus').setValue(obj.policyStatus);
    this.policyDetails.get('policyTerm').setValue(obj.policyTerm);
    this.policyDetails.get('clientId').setValue(obj.clientId);
    this.policyDetails.get('policyIssueDate').setValue(new Date(obj.policyIssueDate));
    this.policyDetails.get('riskComncDate').setValue(new Date(obj.riskComncDate));
    this.policyDetails.get('nextPremiumPayDate').setValue(new Date(obj.nextPremiumPayDate));

    if (this.edit_type == 'group') {
      obj.isPersonal = false;
    } else {
      obj.isPersonal = true;
    }

    this.policyDetails.get('isPersonal').setValue(obj.isPersonal);
    this.addRemoveFields(obj.isPersonal);

    if (obj.isPersonal) {
      this.policyDetails.get('isPersonal').disable();
    } else {
      this.policyDetails.get('isPersonal').enable();
      this.policyDetails.get('companyName').setValue(this.orgName);
    }

    let orgForm: any = this.policyDetails.get('orgPolicy');
    let userForm: any = this.policyDetails.get('userPolicy');

    if (orgForm.controls) {

      if (obj.orgPolicy && obj.orgPolicy.id) {
        orgForm.get('id').setValue(obj.orgPolicy.id);
      }
      if (obj.orgPolicy && obj.orgPolicy.employeeCount) {
        orgForm.get('employeeCount').setValue(obj.orgPolicy.employeeCount);
      }
      if (obj.orgPolicy && obj.orgPolicy.policyRenewalDate) {
        orgForm.get('policyRenewalDate').setValue(new Date(obj.orgPolicy.policyRenewalDate));
      }
      if (obj.orgPolicy && obj.orgPolicy.source) {
        orgForm.get('source').setValue(obj.orgPolicy.source);
      }
    }

    if (userForm.controls && obj.isPersonal) {
      if (obj.orgPolicy && obj.userPolicy.id) {
        userForm.get('id').setValue(obj.userPolicy.id);
      }
      // if(obj.userPolicy && obj.userPolicy.policyRenewalDate) {
      //   userForm.get('policyRenewalDate').setValue(new Date(obj.userPolicy.policyRenewalDate));
      // }
      if (obj.userPolicy && obj.userPolicy.sumInsured) {
        userForm.get('sumInsured').setValue(obj.userPolicy.sumInsured);
      }
    }

    if (this.edit_type == 'group') {
      let roleList = this._layoutService.user ? this._layoutService.user['roleList'] : [];
      let index = roleList.findIndex(o => o.name === "GroupOwner");
      if (index == -1) {
        this.policyDetails.disable();
      }
    } else {
      userForm.get('nomineeFirstName').setValidators([]);
      userForm.get('nomineeLastName').setValidators([]);
    }
  }

  updateDetails() {

    let formValid = this.validateForm();
    if (formValid) {

      this._spinnerService.show();
      let _url = environment.baseUrl + APP_URL.SAVE_POLICY;

      let param = Object.assign({}, this.policyDetails.value);
      if (this._tableService.selRecord && this._tableService.selRecord['id']) {
        if (this.edit_type == 'group') {
          param['isPersonal'] = false;
        } else {
          param['isPersonal'] = true;
        }
      }

      let postObj = { data: param, nominees: this.nomineesList };

      this._registerService.submitCompanyData(_url, postObj).subscribe(async (res) => {
        this._spinnerService.hide();
        if (res.status === ServiceResponse.STATUS_SUCCESS) {
          swal.fire({
            text: 'Policy saved successsfully',
            icon: 'success',
            onClose: () => {
              this._router.navigate(['policy-dashboard']);
            }
          });
        } else {
          swal.fire({ text: res.error, icon: 'error' });
        }
      }, (err) => {
        this._spinnerService.hide();
        swal.fire({ text: 'Something went wrong', icon: 'error' });
      })
    }
  }

  backProcess() {
    this._location.back();
  }

  submitDetails() {

    this.policyDetails.get('policyStatus').setValue('Active');
    this.updateDetails();
  }
}
