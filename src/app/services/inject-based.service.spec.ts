import { TestBed } from '@angular/core/testing';

import { InjectBasedService } from './inject-based.service';

describe('InjectBasedService', () => {
  let service: InjectBasedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InjectBasedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
