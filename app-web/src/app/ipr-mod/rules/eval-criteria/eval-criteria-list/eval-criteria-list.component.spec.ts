import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvalCriteriaListComponent } from './eval-criteria-list.component';

describe('EvalCriteriaListComponent', () => {
  let component: EvalCriteriaListComponent;
  let fixture: ComponentFixture<EvalCriteriaListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvalCriteriaListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvalCriteriaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
