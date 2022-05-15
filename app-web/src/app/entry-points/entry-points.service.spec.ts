import { TestBed } from '@angular/core/testing';

import { EntryPointsService } from './entry-points.service';

describe('EntryPointsService', () => {
  let service: EntryPointsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntryPointsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
