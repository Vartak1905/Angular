import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QualCriteriaComponent } from './qual-criteria.component';

describe('QualCriteriaComponent', () => {
  let component: QualCriteriaComponent;
  let fixture: ComponentFixture<QualCriteriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QualCriteriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QualCriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
