import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyRegistrationFormComponent } from './company-registration-form.component';

describe('CompanyRegistrationFormComponent', () => {
  let component: CompanyRegistrationFormComponent;
  let fixture: ComponentFixture<CompanyRegistrationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyRegistrationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyRegistrationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
