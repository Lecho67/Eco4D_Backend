// src/modules/solicitudes/services/solicitud.service.ts
import { Injectable } from '@nestjs/common';
import { SolicitudRepository } from './respository/solicitud.respository';
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
}