import { PrismaService } from 'src/prisma.service';
import { CreateSolicitudDto } from '../dto/create-solicitud.dto';
export declare class SolicitudRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create(createSolicitudDto: CreateSolicitudDto, solicitanteId: number): Promise<{
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
    findAllByPaciente(pacienteId: number): Promise<({
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
    findAllOpenSolicitudes(): Promise<({
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
