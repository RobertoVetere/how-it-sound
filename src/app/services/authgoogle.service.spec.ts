import { TestBed } from '@angular/core/testing';

import { AuthgoogleService } from './authgoogle.service';

describe('AuthgoogleService', () => {
  let service: AuthgoogleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthgoogleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
