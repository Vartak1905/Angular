import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessRulesViewComponent } from './process-rules-view.component';

describe('ProcessRulesViewComponent', () => {
  let component: ProcessRulesViewComponent;
  let fixture: ComponentFixture<ProcessRulesViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessRulesViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessRulesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
