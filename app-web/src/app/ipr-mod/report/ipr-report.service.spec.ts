import { TestBed } from '@angular/core/testing';

import { IprReportService } from './ipr-report.service';

describe('IprReportService', () => {
  let service: IprReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IprReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
