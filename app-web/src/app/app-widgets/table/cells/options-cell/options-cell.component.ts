import { Component, OnInit, Input } from '@angular/core';
import { ColumnConfig } from 'material-dynamic-table';
import { TableViewService } from '../../table-view/table-view.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-options-cell',
  templateUrl: './options-cell.component.html',
  styleUrls: ['./options-cell.component.css']
})
export class OptionsCellComponent implements OnInit {

  @Input()
  column: ColumnConfig;

  @Input()
  row: Object;

  menuList: Array<Object> = [];
  timedOutCloser;
  rowData: Object;

  constructor(
    private _tableService: TableViewService,
  ) { }

  ngOnInit(): void {
    this._tableService._tableData$.subscribe(data => {
      if (data && this.menuList.length == 0) {
        this.menuList = data['config'].menuList;
        this.rowData = data["data"][this._tableService.curRowIndex];
        this._tableService.curRowIndex++;
      }
    })
  }

  onMenuSelection(menuName: String) {
    this._tableService.emitIsOptionSelect(false);
    if (menuName) {
      this.menuList.forEach((menu: any) => {

        if (menuName == menu['name']) {
          // menu.onClick();
          this._tableService.selRecord = this.row;
          this._tableService.selMenu = menu;

          if (menu['handler'] && menu['handler'] != null) {
            // this._router.navigate([menu['route']]);
            menu.handler();
          } else {
            this._tableService.menuName = menu['name'];
            this._tableService.pageName = menu['page'];
            this._tableService.emitIsOptionSelect(true);
          }
        }
      });
    }
  }
}
