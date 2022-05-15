import { Component, OnInit } from '@angular/core';
import { AppLayoutService } from '../app-layout.service';

@Component({
  selector: 'app-left-side',
  templateUrl: './left-side.component.html',
  styleUrls: ['./left-side.component.css']
})
export class LeftSideComponent implements OnInit {

  constructor(
    private _layoutService: AppLayoutService
  ) { }

  menuList: Array<Object> = []; 

  ngOnInit(): void {

    this._layoutService._menuDetails$.subscribe(data => {
      if (data && this.menuList) {
       this.menuList = data;
      }
    })
  }
}
