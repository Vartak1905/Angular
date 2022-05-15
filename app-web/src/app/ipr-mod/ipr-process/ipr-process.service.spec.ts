import { TestBed } from '@angular/core/testing';

import { IprProcessService } from './ipr-process.service';

describe('IprProcessService', () => {
  let service: IprProcessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IprProcessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
