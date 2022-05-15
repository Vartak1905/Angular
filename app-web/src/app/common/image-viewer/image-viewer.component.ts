import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.css']
})
export class ImageViewerComponent implements OnInit {
  
  imgURL:any = '';
  imgTitle:any = '';
  constructor(
    public dialogRef: MatDialogRef<ImageViewerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {
  }

  ngOnInit(): void {
    this.imgTitle = this.data.title;
    this.imgURL = this.data.src;
  }
  closeModal(): void {
    this.dialogRef.close();
  }
  

}
