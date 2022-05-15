import { TestBed } from '@angular/core/testing';

import { LovFetcherService } from './lov-fetcher.service';

describe('LovFetcherService', () => {
  let service: LovFetcherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LovFetcherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
