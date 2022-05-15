import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalrfprulesComponent } from './calrfprules.component';

describe('CalrfprulesComponent', () => {
  let component: CalrfprulesComponent;
  let fixture: ComponentFixture<CalrfprulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalrfprulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalrfprulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
