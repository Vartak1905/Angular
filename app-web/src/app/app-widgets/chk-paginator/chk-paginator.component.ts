import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-chk-paginator',
  templateUrl: './chk-paginator.component.html',
  styleUrls: ['./chk-paginator.component.css']
})
export class ChkPaginatorComponent implements OnInit {


  @Input() dataList: Array<any> = [];
  @Input() singSelTitle: string = "";
  @Input() multiSelTitle: string = "";
  @Input() filter: boolean = false;
  @Input() filterItems: Array<any> = [];
  @Input() isEditable: boolean = true;
  @Input() searchPlaceholder;
  @Input() pageSize = 8;

  @Output() onDataChecked = new EventEmitter<any>();

  subDataList: Array<any> = [];
  selDataList: Array<any> = [];
  pageData: Array<any> = [];
  fieldName: string = null;
  pageEvent: PageEvent;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor() { }

  ngOnInit(): void {

    this.selDataList = this.dataList.filter(e => e["checked"] == true);

    this.onDataChecked.emit(this.selDataList);
    Object.assign(this.subDataList, this.dataList);
    this.updatePageData(this.pageSize, 1);

    if (this.filter && this.filterItems?.length > 0) {
      let item = this.filterItems[0];
      this.initiateFilter(item?.name, item?.label);
    }

  }

  /** Assigning data list of insurance after pagination */
  updatePageData(pageSize, pageIndex) {
    this.pageData = this.paginateArr(this.subDataList, pageSize, pageIndex);
  }

  /** Updating dataList after page change event*/
  public pageChange(event?: PageEvent) {
    this.updatePageData(this.pageSize, event?.pageIndex + 1);
    this.updateCheckedInPageData();
    return event;
  }

  paginateArr(array, pageSize, pageNumber) {
    return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
  }

  /** Updating 'checked' property of  this.insPageData which are checked*/
  updateCheckedInPageData() {
    for (let subIns of this.pageData) {
      for (let selIns of this.selDataList) {
        if (subIns.id == selIns.id) {
          subIns["checked"] = true;
        }
      }
    }
  }

  onDataSel($event, comp) {

    if (!this.isEditable) {
      return;
    }

    if ($event.checked) {
      this.selDataList.push(comp);
      comp["checked"] = true;
    } else {
      this.selDataList = this.selDataList.filter(function (e) {
        return e.id !== comp.id;
      });

      comp["checked"] = false;
    }

    this.onDataChecked.emit(this.selDataList);
  }

  onDataSearch(value) {
    if (!this.fieldName) {
      return;
    }

    this.subDataList = this.dataList ? this.dataList.filter(item => item[this.fieldName]?.toString()?.search(new RegExp(value, 'i')) > -1) : [];

    /** If lengh of subInsCompanies is more than 8 then assiging lsubInsCompanies.length to pageSize*/
    if (this.subDataList.length < 8) {
      this.pageSize = this.subDataList.length;
    } else {
      this.pageSize = 8;
    }

    this.paginator.firstPage();
    this.updatePageData(this.pageSize, 1);
    this.updateCheckedInPageData();
  }

  initiateFilter(fieldName, fieldLabel) {
    this.fieldName = fieldName;
    this.searchPlaceholder = "Search by " + fieldLabel
  }

  onChkClick($event) {
    if (!this.isEditable && $event) {
      $event.preventDefault();
    }
  }
}
