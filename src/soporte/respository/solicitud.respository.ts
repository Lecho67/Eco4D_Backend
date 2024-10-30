import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateSolicitudDto } from '../dto/create-solicitud.dto';

@Injectable()
export class SolicitudRepository {
  constructor(private prisma: PrismaService) {}

  async create(createSolicitudDto: CreateSolicitudDto, solicitanteId: number) {
    const { titulo, tipo, descripcion } = createSolicitudDto;
    return this.prisma.solicitudSoporte.create({
      data: {
        titulo,
        tipo,
        descripcion,
        solicitanteId,
        estado: 'A', // Valor por defecto
      },
      include: {
        solicitante: {
          select: {
            nombre_completo: true,
            correo_electronico: true
          }
        }
      }
    });
  }

  async findAllByPaciente(pacienteId: number) {
    return this.prisma.solicitudSoporte.findMany({
      where: {
        solicitanteId: pacienteId
      },
      include: {
        solicitante: {
          select: {
            nombre_completo: true,
          }
        },
        encargado: {
          select: {
            nombre_completo: true,
          }
        }
      },
      orderBy: {
        fechaReporte: 'desc'
      }
    });
  }

  async findAllOpenSolicitudes() {
    return this.prisma.solicitudSoporte.findMany({
      where: {
        estado: 'A'
      },
      include: {
        solicitante: {
          select: {
            nombre_completo: true,
            correo_electronico: true
          }
        }
      },
      orderBy: {
        fechaReporte: 'asc'
      }
    });
  }
}