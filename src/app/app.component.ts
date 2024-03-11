import { Component, OnInit } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
} from '@angular/common/http';
import { DocumentoEntrega } from './model/documentoEntrega.model';
import { DocumentoEntregaService } from './services/documento-entrega/documento-entrega.service';
import { GuiaTransporte } from './model/guiaTransporte.model';
import { GuiaEntregaServiceService } from './services/guia-transporte/guia-transporte.service';
import { ArchivoS3Service } from './services/archivo-s3/archivo-s3.service';
import { saveAs } from 'file-saver';

import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar'
import { DialogoConfirmacionComponent } from './dialogo-confirmacion/dialogo-confirmacion.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'angular-entregas';

  documentosEntrega!: any[];
  guiasTransporte!: any[];
  idGuiaTransporte!: number;

  barraCarga: boolean = false;

  //Ver resultados
  verResultados: boolean = false;

  // Declaración de variables para manejar los archivos
  archivo: File | null = null;

  guiaTransporte: any = {
    idGuiaTransporte: '',
    fecha: '',
    cliente: '',
    fechaGuiaTransporte: '',
    destino: '',
    fotoPrueba: '',
  };

  displayedColumns: string[] = [
    'idDocumentoEntrega',
    'fechaDespacho',
    'estadoEntrega',
    'fotoPrueba',
    'acciones',
  ];
  dataSource!: MatTableDataSource<GuiaTransporte>;

  constructor(
    private guiaTransporteService: GuiaEntregaServiceService,
    private documentoEntregaService: DocumentoEntregaService,
    private archivoS3Service: ArchivoS3Service,
    public dialogo: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    if (!this.guiaTransporte) {
      this.verResultados = false;
    }
  }

  buscarDocumentosEntregaPorGuiaTransporte() {
    this.documentoEntregaService
      .buscarIdGuiaTransporte(this.idGuiaTransporte)
      .subscribe((val) => {
        this.dataSource = new MatTableDataSource(val);
        this.verResultados = true;
      });
  }

  buscarGuiaTransportePorId() {
    this.guiaTransporteService
      .buscarId(this.idGuiaTransporte)
      .subscribe((val) => {
        this.guiaTransporte = val;
        if (!this.guiaTransporte) {
          this.verResultados = false;
          this.showDialog('Ingrese un número de guía de transporte')
        } else {
          this.buscarDocumentosEntregaPorGuiaTransporte();
          
        }
      },
      err => this.showDialog('No existe ningún resgistro')
      );
  }
  capturarArchivo(event: any) {
    this.archivo = event.target.files[0];
  }
  cargarArchivo(idDocumento: string) {
    if (this.archivo) {
      const formData = new FormData();
      formData.append(
        'file',
        this.archivo,
        this.idGuiaTransporte + 'G_' + this.archivo.name
      );
      this.archivoS3Service
        .cargarDocumentoEntrega(formData, idDocumento)
        .subscribe((event) => {
          this.progresoServicio(event, idDocumento);
          this.archivo = null;
          this.buscarDocumentosEntregaPorGuiaTransporte();
          this.barraCarga = false;
        });
    }
  }

  cargarArchivoG(idDocumento: string) {
    if (this.archivo) {
      const formData = new FormData();
      formData.append(
        'file',
        this.archivo,
        this.archivo.name
      );
      this.archivoS3Service
        .cargarGuiaTransporte(formData, idDocumento)
        .subscribe((event) => {
          this.progresoServicio(event, idDocumento);
          this.archivo = null;
          this.buscarGuiaTransportePorId();
          this.barraCarga = false;
        });
    }
  }
  descargarArchivo(nombreArchivo: string) {
    this.archivoS3Service.descargar(nombreArchivo).subscribe((event) => {
      this.progresoServicio(event, nombreArchivo);
      this.barraCarga = false;
    });
  }
  eliminarArchivo(nombreArchivo: string, idDocumentoPrueba: string) {
    this.archivoS3Service
      .eliminar(nombreArchivo, idDocumentoPrueba)
      .subscribe(() => {
        this.buscarDocumentosEntregaPorGuiaTransporte();
        this.barraCarga = false;
      });
  }

  eliminarArchivoG(nombreArchivo: string, idDocumentoPrueba: string) {
    this.archivoS3Service
      .eliminarG(nombreArchivo, idDocumentoPrueba)
      .subscribe(() => {
        this.buscarGuiaTransportePorId();
        this.barraCarga = false;
      });
  }

  mostrarDialogoG(nombreArchivo: string,idDocumentoPrueba: string): void {
    this.dialogo
      .open(DialogoConfirmacionComponent, {
        data: `¿Estas seguro de querer eliminar el documento de prueba ${nombreArchivo} `
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.eliminarArchivoG(nombreArchivo,idDocumentoPrueba)
        }
      });
  }

  mostrarDialogo(nombreArchivo: string,idDocumentoPrueba: string): void {
    this.dialogo
      .open(DialogoConfirmacionComponent, {
        data: `¿Estas seguro de querer eliminar el documento de prueba ${nombreArchivo} `
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.eliminarArchivo(nombreArchivo,idDocumentoPrueba)
        }
      });
  }

  private progresoServicio(
    httpEvent: HttpEvent<string[] | Blob>,
    fname: string
  ): void {
    switch (httpEvent.type) {
      case HttpEventType.UploadProgress:
        this.barraCarga = true;
        break;
      case HttpEventType.DownloadProgress:
        this.barraCarga = true;
        break;
      case HttpEventType.ResponseHeader:
        break;
      case HttpEventType.Response:
        if (httpEvent.body instanceof Array) {
          this.barraCarga = false;
        } else {
          saveAs(
            new File([httpEvent.body!], fname, {
              type: `${httpEvent.headers.get('Content-Type')};charset=utf-8`,
            })
          );
        }
        this.barraCarga = false;
        break;
      default:
        break;
    }
  }

  showDialog(errorMessage: string) {
    this.snackBar.open(errorMessage, 'Alerta!', {
      duration: 2000
    });
  };
}
