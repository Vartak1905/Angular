import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-close-btn',
  templateUrl: './close-btn.component.html',
  styleUrls: ['./close-btn.component.css']
})
export class CloseBtnComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  clickOnClose($event) {
    const parent = $event?.currentTarget?.parentNode?.parentNode;
    
    if (parent) {
      parent.remove();
    }
  
  }
}
