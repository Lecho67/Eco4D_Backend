import { SolicitudRepository } from './repository/solicitud.repository';
import { CreateSolicitudDto } from './dto/create-solicitud.dto';
export declare class SoporteService {
    private readonly solicitudRepository;
    constructor(solicitudRepository: SolicitudRepository);
    createSolicitud(createSolicitudDto: CreateSolicitudDto, solicitanteId: number): Promise<{
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
    getSolicitudesByPaciente(pacienteId: number): Promise<({
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
    añadirFechaSolucion(id: number): Promise<{
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
