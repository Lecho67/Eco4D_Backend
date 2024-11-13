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
        id: number;
        descripcion: string;
        titulo: string;
        fechaReporte: Date;
        fechaSolucion: Date | null;
        tipo: string;
        estado: string;
        solicitanteId: number;
    }>;
    getMisSolicitudes(req: any): Promise<({
        solicitante: {
            nombre_completo: string;
        };
    } & {
        id: number;
        descripcion: string;
        titulo: string;
        fechaReporte: Date;
        fechaSolucion: Date | null;
        tipo: string;
        estado: string;
        solicitanteId: number;
    })[]>;
    getOpenSolicitudes(): Promise<({
        solicitante: {
            nombre_completo: string;
            correo_electronico: string;
        };
    } & {
        id: number;
        descripcion: string;
        titulo: string;
        fechaReporte: Date;
        fechaSolucion: Date | null;
        tipo: string;
        estado: string;
        solicitanteId: number;
    })[]>;
    getSolicitudById(id: number): Promise<{
        solicitante: {
            nombre_completo: string;
            correo_electronico: string;
        };
    } & {
        id: number;
        descripcion: string;
        titulo: string;
        fechaReporte: Date;
        fechaSolucion: Date | null;
        tipo: string;
        estado: string;
        solicitanteId: number;
    }>;
    anadirFechaSolucion(id: number): Promise<{
        id: number;
        descripcion: string;
        titulo: string;
        fechaReporte: Date;
        fechaSolucion: Date | null;
        tipo: string;
        estado: string;
        solicitanteId: number;
    }>;
}
