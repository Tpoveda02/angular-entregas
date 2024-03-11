import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { backendURL } from 'src/app/shared/variables';
@Injectable({
  providedIn: 'root',
})
export class ArchivoS3Service {
  //Local Variables
  backendURL: string = `${backendURL}/archivo`;

  constructor(private http: HttpClient) {}

  // define function to upload files
  cargarGuiaTransporte(
    formData: FormData,
    idGuiaTransporte: string
  ): Observable<HttpEvent<string[]>> {
    return this.http.post<string[]>(
      `${this.backendURL}/cargar/guiaTransporte/${idGuiaTransporte}`,
      formData,
      {
        reportProgress: true,
        observe: 'events',
      }
    );
  }
  cargarDocumentoEntrega(
    formData: FormData,
    idDocumentoEntrega: string
  ): Observable<HttpEvent<string[]>> {
    return this.http.post<string[]>(
      `${this.backendURL}/cargar/documentoEntrega/${idDocumentoEntrega}`,
      formData,
      {
        reportProgress: true,
        observe: 'events',
      }
    );
  }

  // define function to download files
  descargar(nombreArchivo: string): Observable<HttpEvent<Blob>> {
    return this.http.get(`${this.backendURL}/descargar/${nombreArchivo}/`, {
      reportProgress: true,
      observe: 'events',
      responseType: 'blob',
    });
  }

  eliminar(nombreArchivo: string, idDocumentoPrueba: string): Observable<HttpEvent<Blob>> {
    return this.http.delete(`${this.backendURL}/eliminar/${nombreArchivo}/${idDocumentoPrueba}`, {
      reportProgress: true,
      observe: 'events',
      responseType: 'blob',
    });
  }

  eliminarG(nombreArchivo: string, idDocumentoPrueba: string): Observable<HttpEvent<Blob>> {
    return this.http.delete(`${this.backendURL}/eliminar/guia/${nombreArchivo}/${idDocumentoPrueba}`, {
      reportProgress: true,
      observe: 'events',
      responseType: 'blob',
    });
  }

  buscarIdDocumento(idDocumentoPrueba: string): Observable<string[]> {
    return this.http.get<string[]>(
      `${this.backendURL}/buscar/${idDocumentoPrueba}`
    );
  }
}
