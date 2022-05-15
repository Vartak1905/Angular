import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsCellComponent } from './options-cell.component';

describe('OptionsCellComponent', () => {
  let component: OptionsCellComponent;
  let fixture: ComponentFixture<OptionsCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionsCellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
