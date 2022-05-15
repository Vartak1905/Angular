import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformerHistoryComponent } from './performer-history.component';

describe('PerformerHistoryComponent', () => {
  let component: PerformerHistoryComponent;
  let fixture: ComponentFixture<PerformerHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerformerHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerformerHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
