import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { TableViewService } from 'src/app/app-widgets/table/table-view/table-view.service';
import { APP_URL } from 'src/app/common/app-urls/app-urls';
import { LovFetcherService } from 'src/app/common/lov-fetcher/lov-fetcher.service';
import { ServiceResponse } from 'src/app/common/service-response';
import { environment } from 'src/environments/environment';
import { RulesService } from '../../../rules.service';
import swal from 'sweetalert2';
import { DocumentService } from 'src/app/common/document/document.service';
import { RegisterService } from 'src/app/common/register-service/register.service';
import { AppLayoutService } from 'src/app/app-layout/app-layout.service';

@Component({
  selector: 'app-ipr-doc-temp',
  templateUrl: './ipr-doc-temp.component.html',
  styleUrls: ['./ipr-doc-temp.component.css']
})
export class IprDocTempComponent implements OnInit {

  rulesObj: any;
  lovDataObj: object = {};
  hideBreadCrumb: Boolean = false;
  itemType: string = null;
  insCategory: number = null;
  insPlanCategory: number = null;
  docList: Array<any> = [];
  docItemType: string = null;
  file = null;
  isUpdateDoc = false;
  isAdmin = false;

  isShowUpdate = false;
  selDoc = null;

  allowdMime = ["application/pdf", "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

  className = "fas fa-file-pdf";
  constructor(
    private _lovService: LovFetcherService,
    private _spinnerService: NgxSpinnerService,
    private _rulesService: RulesService,
    private _tableService: TableViewService,
    private _matSnackbar: MatSnackBar,
    private _location: Location,
    private _doctServ: DocumentService,
    private _regServ: RegisterService,
    private _layoutService: AppLayoutService
  ) { }

  ngOnInit(): void {
    this.updtIsAdmin();
    this.getLovData();
    this.fetchRules();
  }

  ngOnDestroy(): void {
    this._tableService.selRecord = null;
  }


  private getLovData() {

    this._spinnerService.show();
    let _url = environment.baseUrl + APP_URL.BUSINESS_LOV_IPR_DOC_TEMP;
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
        let itemType = res.response.itemType;
        this.rulesObj = data;
        this.itemType = itemType;


        this.fetchAllDocuments();
      }

    }, (err) => {
    })

  }

  fetchRules() {

    this._spinnerService.show();
    let _url = environment.baseUrl + APP_URL.BUSINESS_RULES_FETCH;

    let _formData = {};
    _formData['iprRuleType'] = 'ipr-document-template';

    this._rulesService.fetchRules(_url, _formData).subscribe(res => {

      this._spinnerService.hide();
      if (res.status === ServiceResponse.STATUS_SUCCESS) {
        let data = res.response.data;
        let itemType = res.response.itemType;

        this.rulesObj = data;
        this.itemType = itemType;


        this.fetchAllDocuments();

      } else {
        swal.fire({ text: res.error, icon: 'error' });
      }
    });

  }



  backProcess() {
    this._location.back();
  }

  updtDocument(iprDoc) {
    window.alert("updating");
    this._spinnerService.show();
    let iprDocReq = JSON.parse(JSON.stringify(iprDoc))
    iprDocReq["src"] = null;
    this._doctServ.fetchDocument(iprDocReq).subscribe(res => {
      if (res.status === ServiceResponse.STATUS_SUCCESS) {

        let document = res.response.data;
        let itemType = res.response.itemType;

        iprDoc["itemId"] = document["id"];
        iprDoc["itemType"] = itemType;
        iprDoc["name"] = document["name"];
        iprDoc["remarks"] = document["remarks"];
        iprDoc["isDocPresent"] = true

      }
      this._spinnerService.hide();

    }, error => {
      this._spinnerService.hide();
      this._matSnackbar.open("Something went wrong while fetching document.", "Dismiss", {
        duration: 2000,
      });

    });


  }


  fetchAllDocuments() {
    this._spinnerService.show();
    this._doctServ.fetchAllDocument({ "itemId": this.rulesObj["id"], "itemType": this.itemType }).subscribe(res => {
      if (res.status === ServiceResponse.STATUS_SUCCESS) {
        this.docList = res.response.data;
        this.docItemType = res.response.itemType;

        if (this.docList != null) {
          let allAttUrl = environment.baseUrl + APP_URL.BUSINESS_FETCH_ALL_ATTACH;
          let itemdIds = [];
          for (let doc of this.docList) {
            if (doc["id"] != null) {
              itemdIds.push(doc["id"]);
            }
          }

          let reqParam = { "itemIdList": itemdIds, "itemType": this.docItemType };

          this._rulesService.getAllAttachments(allAttUrl, reqParam).subscribe(res => {
            if (res.status === ServiceResponse.STATUS_SUCCESS) {
              this._spinnerService.hide();
              let attachList = res.response["attachmentData"];
              for (let doc of this.docList) {
                if (attachList[doc.id]) {
                  doc["attachment"] = attachList[doc.id];
                }
              }
            } else {
              this._spinnerService.hide();
            }
          }, error => {

          });
        }
      }


    }, error => {
      this._spinnerService.hide();
    });
  }

  addFile() {
    if (!this.file || !this.insCategory || !this.insPlanCategory) {
      this._matSnackbar.open("Invalid input", "Dismiss", {
        duration: 2000,
      });
      return;
    }

    if (this.isUpdateDoc && this.isShowUpdate && this.selDoc && this.selDoc["attachment"]) {
      swal.fire({
        title: 'Document template for selected combination is already available',
        text: "Would you like to update?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, update it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          this.saveFile();
        } else {
          swal.fire(
            'Cancelled',
            'Your document template is safe :)',
            'error'
          )
        }
      })
    } else {
      this.saveFile();
    }

  }

  saveFile() {

    let formData = new FormData()
    formData.append('selectedFile', this.file);
    formData.append('itemId', this.rulesObj["id"]);
    formData.append('itemType', this.itemType);
    formData.append('attachType', "DOCUMENT");
    //formData.append('rfpDocumentTemplate', this.insCategory + "," + this.insPlanCategory);
    formData.append('rfpDocumentTemplate', "RFP Document Template");
    let jsonProps = "{";
    jsonProps += '"insuranceCategory":';
    jsonProps += this.insCategory;
    jsonProps += ",";
    jsonProps += '"insurancePlanCategory":';
    jsonProps += this.insPlanCategory;
    jsonProps += "}";
   
    formData.append('properties',jsonProps);
    let _url_save_doc = environment.baseUrl + APP_URL.BUSINESS_SAVE_DOCUMENT;

    this._spinnerService.show();
    this._doctServ.saveDocument(_url_save_doc, formData).subscribe(res => {

      if (res.status === ServiceResponse.STATUS_SUCCESS) {

        this.clearForm();

        this.fetchAllDocuments();
        this._matSnackbar.open("Document uploaded successfully.", "Dismiss", {
          duration: 2000,
        });
      } else {

        this._spinnerService.hide();
        swal.fire({ text: res.error, icon: 'error' });

      }
    });
  }
  uploadFile(files) {
    if (files.length === 0)
      return;

    var mimeType = files[0].type;
    if (this.allowdMime.indexOf(mimeType) < 0) {
      this.clearInputFile();
      swal.fire({ text: "Uploaded filed is not allowed, allowed extensions are pdf, doc and docx. ", icon: 'error' });
      return;
    }

    this.file = files[0];

  }

  downloadFile(attachment) {
    if (attachment == null) {
      return false;
    }
    this._spinnerService.show();
    this._regServ.getAttachment({ itemId: attachment['itemId'], itemType: attachment['itemType'], attachType: "DOCUMENT" }).subscribe((data) => {
      this._spinnerService.hide();
      if (data.status == ServiceResponse.STATUS_SUCCESS && data.response && data.response.attachmentData) {
        let imageData = data.response.attachmentData;
        var ext = imageData.fileName.substr(imageData.fileName.lastIndexOf('.') + 1);
        let docData = imageData.data;

        let fileName = imageData["fileName"];

        if (ext == "doc") {
          var link = document.createElement('a');
          link.innerHTML = 'Download DOC file';
          link.download = fileName;
          link.href = 'data:application/octet-stream;base64,' + docData;
          link.click();
          window.URL.revokeObjectURL(link.href);
        }
        if (ext == "docx") {
          var link = document.createElement('a');
          link.innerHTML = 'Download PDF file';
          link.download = fileName;
          link.href = 'data:application/octet-stream;base64,' + docData;
          link.click();
          window.URL.revokeObjectURL(link.href);
        }
        if (ext == "pdf") {
          var link = document.createElement('a');
          link.innerHTML = 'Download PDF file';
          link.download = fileName;
          link.href = 'data:application/octet-stream;base64,' + docData;
          link.click();
          window.URL.revokeObjectURL(link.href);
        }
      }
    });
  }


  updateNewTemplate(props) {
    let inCat=Number(props["insuranceCategory"]);
    let inPlanCat=Number(props["insurancePlanCategory"]);
       if (inCat && inPlanCat) {
        // let nameArr = name.split(",");
         this.insCategory = inCat;
         this.insPlanCategory = inPlanCat;
         this.isUpdateDoc = true;
         this.isShowUpdate = false;
         this.selDoc = null;
         this.file = null;
   
         this.clearInputFile();
   
         window.scrollTo({
           top: 0,
           behavior: 'smooth',
         })
   
       }
     }

  deleteAttacment(doc) {
    if (!doc) {
      return;
    }

    swal.fire({
      title: 'Are you sure you want to delete this template?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {

        let formData = new FormData()
        formData.append('itemId', doc["id"]);
        formData.append('itemType', this.docItemType);

        let attachDeleteUrl = environment.baseUrl + APP_URL.BUSINESS_DELETE_ATTACHMENT;

        this._spinnerService.show();
        this._rulesService.deleteAttachment(attachDeleteUrl, formData).subscribe(res => {
          if (res.status === ServiceResponse.STATUS_SUCCESS) {

            this._spinnerService.hide();
            this._matSnackbar.open("Template deleted successfully", "Dismiss", {
              duration: 2000,
            });
            this.clearForm();
            this.fetchAllDocuments();
          } else {

            this._spinnerService.hide();
            swal.fire({ text: res.error, icon: 'error' });

          }
        }, error => {
          this._spinnerService.hide();
          swal.fire({ text: "Something went wrong while deleteing template.", icon: 'error' });
        })
      }
    })


  }
  onDocTypeChange() {
    this.isUpdateDoc = false;
    this.isShowUpdate = false;
    this.selDoc = null;

  if(this.insCategory && this.insPlanCategory){
  for (let doc of this.docList) {
   // let prop = doc.properties ? JSON.parse(doc?.properties): {};
    //console.log('props is ', prop, this.insCategory, this.insPlanCategory);
    let insCat = doc.properties["insuranceCategory"];
    let insPlanCat = doc.properties["insurancePlanCategory"];

    if(insCat == this.insCategory && insPlanCat == this.insPlanCategory){
      this.isUpdateDoc = true;
          this.isShowUpdate = true;
          this.selDoc = doc;
          break;
    }

  }

}

  }

  clearForm() {
    this.insCategory = null;
    this.insPlanCategory = null;
    this.clearInputFile();
    this.file = null;
    this.isUpdateDoc = false;
    this.isShowUpdate = false;
    this.selDoc = null;
  }

  getInsCategory(docName) {
    if (docName) {
      let docNameArr = docName.split(",");
      if (docNameArr.length > 0) {
        return docNameArr[0];
      }
    }
    return null;
  }

  getInsPlanCategory(docName) {
    if (docName) {
      let docNameArr = docName.split(",");
      if (docNameArr.length > 0) {
        return docNameArr[1];
      }
    }
    return null;
  }
  skip() {
    return false;
  }

  updtIsAdmin() {
    let roleList = this._layoutService.user && this._layoutService.user['roleList'] ? this._layoutService.user['roleList'] : [];
    if (roleList) {
      let index = roleList.findIndex(item => item.name == "CQRWorld Admin");
      if (index != -1) {
        this.isAdmin = true;
      }
    }

  }

  clearInputFile() {
    document.getElementById('documentFile')["value"] = '';
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

  getFileName(fileName) {

    if (fileName && fileName.indexOf(".") > -1) {
      return fileName.split('.').slice(0, -1).join('.')
    }
    return "";
  }

getItemNameById(properties,key){
  if(!properties || !key){
    return;
  }
 let catId=properties[key];
 let itemList=this.lovDataObj[key];

  for(let item of itemList){
   if(item?.id == catId){
     return item?.itemName;
   }
 }
 
  }

}
