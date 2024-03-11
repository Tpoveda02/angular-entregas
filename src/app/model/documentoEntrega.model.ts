import { GuiaTransporte } from "./guiaTransporte.model";

export interface DocumentoEntrega{
    idDocumentoEntrega?: number;
    fechaEntrega?: Date;
    fechaDespacho?: Date;
    guiaTransporte?: GuiaTransporte;
    estadoEntrega?: string;
    observacion?: string;
    fotoPrueba?: string;
}