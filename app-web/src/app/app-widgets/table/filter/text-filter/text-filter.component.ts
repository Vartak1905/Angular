import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ColumnFilter } from 'material-dynamic-table';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { TextFilter } from './text-filter.model';
import { TableViewService } from '../../table-view/table-view.service';

@Component({
  selector: 'app-text-filter',
  templateUrl: './text-filter.component.html'
})
export class TextFilterComponent implements OnInit {

  model: TextFilter;
  displayName: string;

  textfg:FormGroup;

  public constructor(
    private _fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<TextFilterComponent>,
    private _tableService: TableViewService,
    @Inject(MAT_DIALOG_DATA) private readonly filterData: ColumnFilter
  ) { }

  ngOnInit() {
    this.displayName = this.filterData.column.displayName;
    this.model = this.filterData.filter || new TextFilter(this.filterData.column.name);
    this.textfg=this._fb.group({
      textInput:[]
    })
  }

  apply() {
    if (this.model.value) {
      this.dialogRef.close(this.model);
      if (this._tableService._filterCallback) {
        this._tableService._filterCallback(this.model, this.filterData);
      }
    } else {
      this.dialogRef.close('');
    }
  }
  clearFilter() {
    if (this._tableService._filterCallback){
      this._tableService._filterCallback(this.model, this.filterData, true);
    }
  }
}
