import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-progress-step',
  templateUrl: './progress-step.component.html',
  styleUrls: ['./progress-step.component.css']
})
export class ProgressStepComponent implements OnInit {

  @Input() stepList: Array<any>;

  stepName: string = "";
  @ViewChild('stepper') stepper;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }


  ngOnInit(): void {
    this.stepList = this.data.stepList;
    this.updateStep();
  }

  ngAfterViewInit() {
    this.stepper._getIndicatorType = () => 'number';
  }

  updateStep() {
    this.stepName = this.stepList[0]?.name;
    let that = this;
    var intervalId = window.setInterval(function () {
      that.stepper.next();
      that.stepName = that.stepList[that.stepper.selectedIndex]?.name;
      if (that.stepper.selectedIndex == 5) {
        clearInterval(intervalId);
      }
    }, 2000);
  }


}
