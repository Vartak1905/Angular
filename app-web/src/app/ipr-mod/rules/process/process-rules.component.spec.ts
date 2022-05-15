import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessRulesComponent } from './process-rules.component';

describe('ProcessRulesComponent', () => {
  let component: ProcessRulesComponent;
  let fixture: ComponentFixture<ProcessRulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessRulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
