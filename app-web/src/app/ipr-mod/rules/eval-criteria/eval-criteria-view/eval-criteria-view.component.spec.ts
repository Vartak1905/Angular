import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvalCriteriaViewComponent } from './eval-criteria-view.component';

describe('EvalCriteriaViewComponent', () => {
  let component: EvalCriteriaViewComponent;
  let fixture: ComponentFixture<EvalCriteriaViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvalCriteriaViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvalCriteriaViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
