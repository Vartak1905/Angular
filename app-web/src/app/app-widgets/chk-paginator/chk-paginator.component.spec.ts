import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChkPaginatorComponent } from './chk-paginator.component';

describe('ChkPaginatorComponent', () => {
  let component: ChkPaginatorComponent;
  let fixture: ComponentFixture<ChkPaginatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChkPaginatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChkPaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
