import { TestBed } from '@angular/core/testing';

import { PwaServiceService } from './pwa-service.service';

describe('PwaServiceService', () => {
  let service: PwaServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PwaServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
