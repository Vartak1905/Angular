import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalRuleCustomComponent } from './cal-rule-custom.component';

describe('CalRuleCustomComponent', () => {
  let component: CalRuleCustomComponent;
  let fixture: ComponentFixture<CalRuleCustomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalRuleCustomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalRuleCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
