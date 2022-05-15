import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessRulesListComponent } from './process-rules-list.component';

describe('ProcessRulesListComponent', () => {
  let component: ProcessRulesListComponent;
  let fixture: ComponentFixture<ProcessRulesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessRulesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessRulesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
