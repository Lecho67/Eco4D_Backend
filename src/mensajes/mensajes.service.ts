import { ForbiddenException, Injectable } from '@nestjs/common';
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

}
