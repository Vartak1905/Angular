import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalRfpComponent } from './cal-rfp.component';

describe('CalRfpComponent', () => {
  let component: CalRfpComponent;
  let fixture: ComponentFixture<CalRfpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalRfpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalRfpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
