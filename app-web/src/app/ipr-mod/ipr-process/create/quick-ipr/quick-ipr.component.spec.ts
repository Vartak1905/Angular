import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickIprComponent } from './quick-ipr.component';

describe('QuickIprComponent', () => {
  let component: QuickIprComponent;
  let fixture: ComponentFixture<QuickIprComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickIprComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickIprComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
