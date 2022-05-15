import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IprDocumentListComponent } from './ipr-document-list.component';

describe('IprDocumentListComponent', () => {
  let component: IprDocumentListComponent;
  let fixture: ComponentFixture<IprDocumentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IprDocumentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IprDocumentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
