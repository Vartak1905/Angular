import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IprSettingsComponent } from './ipr-settings.component';

describe('IprSettingsComponent', () => {
  let component: IprSettingsComponent;
  let fixture: ComponentFixture<IprSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IprSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IprSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
