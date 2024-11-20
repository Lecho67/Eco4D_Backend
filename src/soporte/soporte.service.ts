// src/modules/solicitudes/services/solicitud.service.ts
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { SolicitudRepository } from './repository/solicitud.repository';
import { CreateSolicitudDto } from './dto/create-solicitud.dto';

@Injectable()
export class SoporteService {
  constructor(private readonly solicitudRepository: SolicitudRepository) {}

  async createSolicitud(createSolicitudDto: CreateSolicitudDto, solicitanteId: number) {
    return this.solicitudRepository.create(createSolicitudDto, solicitanteId);
  }

  async getSolicitudesByPaciente(pacienteId: number) {
    return this.solicitudRepository.findAllByPaciente(pacienteId);
  }

  async getOpenSolicitudes() {
    return this.solicitudRepository.findAllOpenSolicitudes();
  }

  async getClosedSolicitudes() {
    return this.solicitudRepository.findAllClosedSolicitudes();
  }

  async getSolicitudById(id: number, user: any) {
    const solicitud = await this.solicitudRepository.findById(id);

    if (!solicitud) {
      throw new BadRequestException('Solicitud no encontrada');
    }

    const esAdministrador = user.rol === 'A';
    const esSolicitante = solicitud.solicitanteId === user.identificacion;

    if (!esAdministrador && !esSolicitante) {
      throw new ForbiddenException('No tienes permiso para acceder a esta solicitud');
    }
    
    return solicitud;
  }

  async añadirFechaSolucion(id:number) {
    return this.solicitudRepository.añadirFechaSolucion(id);
  }
}