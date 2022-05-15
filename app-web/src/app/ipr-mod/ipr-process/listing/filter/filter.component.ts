import { Component, OnInit, Inject } from '@angular/core';
import { ListingComponent } from '../listing.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html'
})
export class FilterComponent implements OnInit {

  displayName: string;
  filterData: string;

  constructor(
    public dialogRef: MatDialogRef<ListingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: object
  ) { }

  ngOnInit(): void {
  }

  onApplyClick(): void {
    this.dialogRef.close(this.filterData);
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }
}
