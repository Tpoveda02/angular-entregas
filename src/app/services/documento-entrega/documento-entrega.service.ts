import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DocumentoEntrega } from 'src/app/model/documentoEntrega.model';
import { backendURL } from 'src/app/shared/variables';

@Injectable({
  providedIn: 'root',
})
export class DocumentoEntregaService {
  backendURL: string = `${backendURL}/documentoEntrega`;
  sectorCambio = new Subject<DocumentoEntrega[]>();
  mensajeCambio = new Subject<string>();

  constructor(private http: HttpClient) {}

  buscar(): Observable<DocumentoEntrega[]> {
    return this.http.get<DocumentoEntrega[]>(this.backendURL);
  }
  buscarId(idDocumentoEntrega: number): Observable<DocumentoEntrega> {
    return this.http.get<DocumentoEntrega>(
      `${this.backendURL}/${idDocumentoEntrega}`
    );
  }

  buscarIdGuiaTransporte(
    idGuiaTransporte: number
  ): Observable<DocumentoEntrega[]> {
    return this.http.get<DocumentoEntrega[]>(
      `${this.backendURL}/guiaTransporte/${idGuiaTransporte}`
    );
  }
}
