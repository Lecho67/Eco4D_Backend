// src/modules/solicitudes/controllers/solicitud.controller.ts
import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { SoporteService } from './soporte.service';
import { CreateSolicitudDto } from './dto/create-solicitud.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/usuarios/roles/roles.guard';
import { Roles } from 'src/usuarios/roles/roles.decorator';
import { Role } from 'src/usuarios/roles/roles.enum';

@Controller('soporte')
@UseGuards(AuthGuard, RolesGuard)
export class SoporteController {
  constructor(private readonly solicitudService: SoporteService) {}

  @Post()
  @Roles(Role.Paciente)
  async createSolicitud(
    @Body() createSolicitudDto: CreateSolicitudDto,
    @Request() req,
  ) {
    return this.solicitudService.createSolicitud(
      createSolicitudDto,
      req.user.cedula,
    );
  }

  @Get('mis-solicitudes')
  @Roles(Role.Paciente)
  async getMisSolicitudes(@Request() req) {
    return this.solicitudService.getSolicitudesByPaciente(req.user.cedula);
  }

  @Get('solicitudes-abiertas')
  @Roles(Role.Administrador)
  async getOpenSolicitudes() {
    return this.solicitudService.getOpenSolicitudes();
  }
}