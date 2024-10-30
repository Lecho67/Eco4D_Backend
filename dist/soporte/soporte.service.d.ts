import { SolicitudRepository } from './respository/solicitud.respository';
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
        id: string;
        titulo: string;
        fechaReporte: Date;
        fechaSolucion: Date | null;
        tipo: string;
        descripcion: string;
        estado: string;
        solicitanteId: number;
        encargadoId: number | null;
    }>;
    getSolicitudesByPaciente(pacienteId: number): Promise<({
        solicitante: {
            nombre_completo: string;
        };
        encargado: {
            nombre_completo: string;
        };
    } & {
        id: string;
        titulo: string;
        fechaReporte: Date;
        fechaSolucion: Date | null;
        tipo: string;
        descripcion: string;
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
        id: string;
        titulo: string;
        fechaReporte: Date;
        fechaSolucion: Date | null;
        tipo: string;
        descripcion: string;
        estado: string;
        solicitanteId: number;
        encargadoId: number | null;
    })[]>;
}
