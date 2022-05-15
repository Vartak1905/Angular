import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyDashboardComponent } from './policy-dashboard.component';

describe('PolicyDashboardComponent', () => {
  let component: PolicyDashboardComponent;
  let fixture: ComponentFixture<PolicyDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
