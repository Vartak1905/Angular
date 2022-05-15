import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TableViewService {

  constructor() { }

  selRecord: Object;
  selMenu: Object;

  isOptionSelect: boolean;
  menuName: string;
  pageName: string;
  curRowIndex: number = 0;
  _filterCallback = null;

  private _tableData: BehaviorSubject<any> = new BehaviorSubject(null);
  public _tableData$ = this._tableData.asObservable();

  private _isOptionSelect: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public _isOptionSelect$ = this._isOptionSelect.asObservable();

  private _columns: BehaviorSubject<any> = new BehaviorSubject(null);
  public _columnsData$ = this._columns.asObservable();

  emitTableData(data: Object) {
    this.curRowIndex = 0;
    this._tableData.next(data);
  }

  unsubscribeTableData() {
    this._tableData.next('');
  }

  emitIsOptionSelect(data: boolean) {
    this._isOptionSelect.next(data);
  }

  unsubscribeIOptionSelect() {
    this._tableData.next(false);
  }

  emitColumnsData(data: Object) {
    this._columns.next(data);
  }
}
