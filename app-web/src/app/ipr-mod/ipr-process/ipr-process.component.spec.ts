import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IprProcessComponent } from './ipr-process.component';

describe('IprProcessComponent', () => {
  let component: IprProcessComponent;
  let fixture: ComponentFixture<IprProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IprProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IprProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
