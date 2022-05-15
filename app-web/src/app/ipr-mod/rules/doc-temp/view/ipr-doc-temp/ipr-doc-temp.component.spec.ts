import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IprDocTempComponent } from './ipr-doc-temp.component';

describe('IprDocTempComponent', () => {
  let component: IprDocTempComponent;
  let fixture: ComponentFixture<IprDocTempComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IprDocTempComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IprDocTempComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
