import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { FilteredDataSource } from '../datasource/filtered-data-source';
import { ColumnConfig, DynamicTableComponent } from 'material-dynamic-table';
import { TableViewService } from './table-view.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.css']
})
export class TableViewComponent implements OnInit {

  constructor(
    private _tableService: TableViewService,
    private _changeDetectorRef: ChangeDetectorRef
  ) { }

  @ViewChild(DynamicTableComponent) dynamicTable: DynamicTableComponent;

  dataList: object[] = [];
  columns: ColumnConfig[] = [];
  @Input() pageSize: number = 10;
  dataSource: FilteredDataSource<Object>;
  @Input() filter: boolean = false;
  @Input() serverSide: boolean = false;
  totalData: number;
  @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;

  pageIndex: number = 0;
  @Output() pageChange = new EventEmitter();

  ngOnInit(): void {
    this.dataSource = new FilteredDataSource<Object>(this.dataList);
    // this.dataSource.paginator = this.paginator;
    this._tableService._tableData$.subscribe(data => {
      if (data && data['data'] && data['config'].headerList) {
        this._tableService.curRowIndex=0;
        
        this.dataSource.filterCallback = this._tableService._filterCallback;
        this.dataList = data['data'];
        let headerList = data['config'].headerList;
        if (data['config'].pageSize) {
          this.pageSize = data['config'].pageSize;
        }
        this.columns = [];
        this._changeDetectorRef.detectChanges();
        headerList.forEach(ele => {
          this.columns.push(ele);
        });
       
        this.dataSource.data = this.dataList;
        if (this.serverSide) {
          setTimeout(() => {
            this.pageIndex = data['config'].pageIndex ? data['config'].pageIndex : 0;
            this.totalData = data['config'].totalRow ? data['config'].totalRow : this.dataList.length;
            if (this.paginator && this.paginator['_length'])
              this.paginator['_length'] = this.totalData;

            if (this.paginator && this.paginator['_pageIndex'])
              this.paginator['_pageIndex'] = this.pageIndex;
            this.dataSource.paginator = this.paginator;
            if (this.dataSource.paginator && this.dataSource.paginator.length) {
              this.dataSource.paginator.length = this.totalData;
            }
            if (this.dataSource.paginator && this.dataSource.paginator.pageIndex) {
              this.dataSource.paginator.pageIndex = this.pageIndex;
            }
          }, 1000);
        }

        this._changeDetectorRef.detectChanges();
      }
    }, (err) => {

    });
    if (this.serverSide) {
      this.changeColumnsEvent();
    }
    
  }
  changeColumnsEvent() {
    this._tableService._columnsData$.subscribe(data => {
      this._tableService.curRowIndex=0;
      this.columns = [];
      this._changeDetectorRef.detectChanges();
      if (data instanceof Array) {
        data.forEach(ele => {
          this.columns.push(ele);
        });
      }
    });
  }
  pageChangeEvent($event) {
    this.pageChange.emit($event);
    this.columns = [];
    this.dataSource.data = [];
  }
}
