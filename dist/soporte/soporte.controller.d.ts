import { SoporteService } from './soporte.service';
import { CreateSolicitudDto } from './dto/create-solicitud.dto';
export declare class SoporteController {
    private readonly solicitudService;
    constructor(solicitudService: SoporteService);
    createSolicitud(createSolicitudDto: CreateSolicitudDto, req: any): Promise<{
        solicitante: {
            nombre_completo: string;
            correo_electronico: string;
        };
    } & {
        titulo: string;
        tipo: string;
        descripcion: string;
        id: string;
        fechaReporte: Date;
        fechaSolucion: Date | null;
        estado: string;
        solicitanteId: number;
        encargadoId: number | null;
    }>;
    getMisSolicitudes(req: any): Promise<({
        solicitante: {
            nombre_completo: string;
        };
        encargado: {
            nombre_completo: string;
        };
    } & {
        titulo: string;
        tipo: string;
        descripcion: string;
        id: string;
        fechaReporte: Date;
        fechaSolucion: Date | null;
        estado: string;
        solicitanteId: number;
        encargadoId: number | null;
    })[]>;
    getOpenSolicitudes(): Promise<({
        solicitante: {
            nombre_completo: string;
            correo_electronico: string;
        };
    } & {
        titulo: string;
        tipo: string;
        descripcion: string;
        id: string;
        fechaReporte: Date;
        fechaSolucion: Date | null;
        estado: string;
        solicitanteId: number;
        encargadoId: number | null;
    })[]>;
}
