import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-column-filter',
  templateUrl: './column-filter.component.html',
  styleUrls: ['./column-filter.component.css']
})
export class ColumnFilterComponent implements OnInit {
  
  constructor(public dialogRef: MatDialogRef<ColumnFilterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    
  }
  setColumn(event,i) {
    this.data[i]['check'] = event.checked;
    
  }
  closeDialogue() {
    this.dialogRef.close(this.data);
  }
}
