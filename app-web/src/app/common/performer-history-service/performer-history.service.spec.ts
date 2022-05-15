import { TestBed } from '@angular/core/testing';

import { PerformerHistoryService } from './performer-history.service';

describe('PerformerHistoryService', () => {
  let service: PerformerHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PerformerHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
