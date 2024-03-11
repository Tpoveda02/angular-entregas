import { TestBed } from '@angular/core/testing';

import { GuiaEntregaServiceService } from './guia-transporte.service';

describe('GuiaEntregaServiceService', () => {
  let service: GuiaEntregaServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GuiaEntregaServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
