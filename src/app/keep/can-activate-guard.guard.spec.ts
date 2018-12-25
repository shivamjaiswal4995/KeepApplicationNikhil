import { TestBed, async, inject } from '@angular/core/testing';

import { CanActivateGuardGuard } from './can-activate-guard.guard';

describe('CanActivateGuardGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanActivateGuardGuard]
    });
  });

  it('should ...', inject([CanActivateGuardGuard], (guard: CanActivateGuardGuard) => {
    expect(guard).toBeTruthy();
  }));
});
