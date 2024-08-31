import { TestBed } from '@angular/core/testing';

import { ConstructorBasedService } from './constructor-based.service';

describe('ConstructorBasedService', () => {
  let service: ConstructorBasedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConstructorBasedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
