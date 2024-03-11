import { TestBed } from '@angular/core/testing';

import { DocumentoEntregaService } from './documento-entrega.service';

describe('DocumentoEntregaService', () => {
  let service: DocumentoEntregaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentoEntregaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
