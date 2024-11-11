// src/modules/solicitudes/services/solicitud.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
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

  async getSolicitudById(id: number) {
    const solicitud = await this.solicitudRepository.findById(id);

    if (!solicitud) {
      throw new BadRequestException('Solicitud no encontrada');
    }
    return solicitud;
  }
}