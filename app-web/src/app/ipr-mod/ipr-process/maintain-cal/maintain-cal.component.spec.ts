import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainCalComponent } from './maintain-cal.component';

describe('MaintainCalComponent', () => {
  let component: MaintainCalComponent;
  let fixture: ComponentFixture<MaintainCalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintainCalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainCalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
