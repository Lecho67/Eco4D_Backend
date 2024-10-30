export declare class SolicitudDto {
    id: string;
    titulo: string;
    fechaReporte: Date;
    fechaSolucion?: Date;
    tipo: string;
    descripcion: string;
    solicitanteId: number;
    encargadoId?: number;
    estado: string;
}
