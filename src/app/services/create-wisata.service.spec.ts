import { TestBed } from '@angular/core/testing';

import { CreateWisataService } from './create-wisata.service';

describe('CreateWisataService', () => {
  let service: CreateWisataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateWisataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
