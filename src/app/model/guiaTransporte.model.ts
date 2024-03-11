import { Cliente } from "./cliente.model";
export interface GuiaTransporte{
    idGuiaTransporte?: number;
    cliente?: Cliente;
    fechaGuiaTransporte?: string;
    destino?: string;
    fotoPrueba?: string;
}