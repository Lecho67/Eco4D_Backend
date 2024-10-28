import { PrismaService } from 'src/prisma.service';
export declare class UsuariosService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getUsers(): import(".prisma/client").Prisma.PrismaPromise<{
        cedula: number;
        nombre_completo: string;
        correo_electronico: string;
        contrasena: string;
        rol: string;
    }[]>;
}
