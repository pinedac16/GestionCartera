import { TestBed, inject } from '@angular/core/testing';

import { InformesService } from './informes.service';

describe('InformesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InformesService]
    });
  });

  it('should be created', inject([InformesService], (service: InformesService) => {
    expect(service).toBeTruthy();
  }));
});
