import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QualCriteriaViewComponent } from './qual-criteria-view.component';

describe('QualCriteriaViewComponent', () => {
  let component: QualCriteriaViewComponent;
  let fixture: ComponentFixture<QualCriteriaViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QualCriteriaViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QualCriteriaViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
