import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalrfprulesViewComponent } from './calrfprules-view.component';

describe('CalrfprulesViewComponent', () => {
  let component: CalrfprulesViewComponent;
  let fixture: ComponentFixture<CalrfprulesViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalrfprulesViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalrfprulesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
