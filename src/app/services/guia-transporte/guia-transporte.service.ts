import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { GuiaTransporte } from 'src/app/model/guiaTransporte.model';
import { backendURL } from 'src/app/shared/variables';
import { MatTableDataSource } from '@angular/material/table';

@Injectable({
  providedIn: 'root'
})
export class GuiaEntregaServiceService {
  

  backendURL: string = `${backendURL}/guiaTransporte`;
  sectorCambio = new Subject<GuiaTransporte[]>();
  mensajeCambio = new Subject<string>();

  constructor(private http: HttpClient) {}

  buscar(): Observable<GuiaTransporte[]> {
    return this.http.get<GuiaTransporte[]>(this.backendURL);
  }
  buscarId(idGuiaTransporte: number): Observable<GuiaTransporte> {
    return this.http.get<GuiaTransporte>(
      `${this.backendURL}/${idGuiaTransporte}`
    );
  }
}
