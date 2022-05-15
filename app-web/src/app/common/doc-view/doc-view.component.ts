import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-doc-view',
  templateUrl: './doc-view.component.html',
  styleUrls: ['./doc-view.component.css']
})
export class DocViewComponent implements OnInit {

  docURL:any = '';
  docTitle:any = '';
  constructor(
    public dialogRef: MatDialogRef<DocViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {
  }

  ngOnInit(): void {
    this.docTitle = this.data.title;
    this.docURL = this.data.src;
  }
  closeModal(): void {
    this.dialogRef.close();
  }
  

}
