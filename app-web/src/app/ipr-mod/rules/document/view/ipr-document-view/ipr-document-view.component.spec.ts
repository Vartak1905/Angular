import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IprDocumentViewComponent } from './ipr-document-view.component';

describe('IprDocumentViewComponent', () => {
  let component: IprDocumentViewComponent;
  let fixture: ComponentFixture<IprDocumentViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IprDocumentViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IprDocumentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
