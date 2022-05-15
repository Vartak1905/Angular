import { TestBed } from '@angular/core/testing';

import { RuleVersionViewGuard } from './rule-version-view.guard';

describe('RuleVersionViewGuard', () => {
  let guard: RuleVersionViewGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RuleVersionViewGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
