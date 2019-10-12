import { TestBed, inject } from '@angular/core/testing';

import { CargaService } from './carga.service';

describe('CargaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CargaService]
    });
  });

  it('should be created', inject([CargaService], (service: CargaService) => {
    expect(service).toBeTruthy();
  }));
});
