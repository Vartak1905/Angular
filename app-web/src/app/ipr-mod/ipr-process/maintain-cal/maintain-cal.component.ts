import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-maintain-cal',
  templateUrl: './maintain-cal.component.html',
  styleUrls: ['./maintain-cal.component.css']
})
export class MaintainCalComponent implements OnInit {

  id;
  uniqueRef;
  itemType;
  issueDate;

  constructor(
    private _router: Router,
    private _location: Location,
  ) {
    let states = this._router.getCurrentNavigation();
    if (states && states.extras && states.extras.state) {
      let state = states.extras.state;
      if (state['id'] && state['itemType'] && state["uniqueRef"]) {

        this.id = state['id'];
        this.itemType = state['itemType'];
        this.uniqueRef = state['uniqueRef'];
        this.issueDate = state["startDate"];

      } else {
        _location.back();
      }
    } else {
      _location.back();
    }
  }

  ngOnInit(): void {
  }

}
