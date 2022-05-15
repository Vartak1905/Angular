import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateIprComponent } from './create-ipr.component';

describe('CreateIprComponent', () => {
  let component: CreateIprComponent;
  let fixture: ComponentFixture<CreateIprComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateIprComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateIprComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
