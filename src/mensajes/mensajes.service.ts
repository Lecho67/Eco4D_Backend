import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
@Injectable()
export class MensajesService {

    constructor(private prisma: PrismaService){}

    async nuevoMensaje(descripcion: string, solicitudId: number, user:any){
        if (user.rol === 'P') {
            const solicitud = await this.prisma.solicitudSoporte.findFirst({
                where: {
                    id: solicitudId,
                    solicitanteId: user.identificacion
                }
            });

            if (!solicitud) {
                throw new ForbiddenException('No tienes permiso para enviar mensajes en esta solicitud');
            }
        }
        const mensaje = await this.prisma.mensaje.create({
            data: {
                descripcion,
                autorId: user.identificacion,
                solicitudId
            }
        });
        return mensaje;
    }

    async obtenerMensajes(
        solicitudId: number,
        usuario: { identificacion: number; rol: string },
    ) {
        // Verificar si la solicitud existe
        const solicitud = await this.prisma.solicitudSoporte.findUnique({
            where: { id: solicitudId },
            select: {
                solicitanteId: true,
            },
        });
    
        if (!solicitud) {
            throw new NotFoundException('La solicitud no existe.');
        }
    
        // Validar condiciones de autorización
        const esAdministrador = usuario.rol === 'A';
        const esSolicitante = solicitud.solicitanteId === usuario.identificacion;
    
        if (!esAdministrador && !esSolicitante) {
            throw new ForbiddenException(
                'No estás autorizado para acceder a este recurso.',
            );
        }
    
        // Realizar la consulta de los mensajes
        const mensajes = await this.prisma.mensaje.findMany({
            where: {
                solicitudId: solicitudId,
            },
            include: {
                autor: {
                    select: {
                        nombre_completo: true,
                    },
                },
            },
        });
    
        return mensajes;
    }

}
