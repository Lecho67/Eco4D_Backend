// src/modules/solicitudes/controllers/solicitud.controller.ts
import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { SoporteService } from './soporte.service';
import { CreateSolicitudDto } from './dto/create-solicitud.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/usuarios/roles/roles.guard';
import { Roles } from 'src/usuarios/roles/roles.decorator';
import { Role } from 'src/usuarios/roles/roles.enum';
import { ApiOperation, ApiResponse,ApiBearerAuth } from '@nestjs/swagger';
@Controller('soporte')
@UseGuards(AuthGuard, RolesGuard)
export class SoporteController {
  constructor(private readonly solicitudService: SoporteService) {}

  @Post()
  @Roles(Role.Paciente)
  @ApiOperation({ summary: 'Crear una nueva solicitud de soporte' })
  @ApiResponse({
    status: 201,
    description: 'Solicitud creada con éxito',
    schema: {
      example: {
        id: "39f270d7-da7b-4025-89de-1037a29915a6",
        titulo: "Problema con el sistema",
        fechaReporte: "2024-10-30T18:04:32.265Z",
        fechaSolucion: null,
        tipo: "fallas tecnicas",
        descripcion: "No puedo acceder a mis diagnósticos",
        estado: "A",
        solicitanteId: 12345678,
        solicitante: {
          nombre_completo: "John Doe",
          correo_electronico: "johndoe@example.com"
        }
      }
    }
  })
  @ApiBearerAuth()
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

  @ApiOperation({ summary: 'Obtener solicitudes de soporte del paciente actual' })
  @ApiResponse({
    status: 200,
    description: 'Lista de solicitudes del paciente',
    schema: {
      example: [
        {
          id: "39f270d7-da7b-4025-89de-1037a29915a6",
          titulo: "Problema con el sistema",
          fechaReporte: "2024-10-30T18:04:32.265Z",
          fechaSolucion: null,
          tipo: "fallas tecnicas",
          descripcion: "No puedo acceder a mis diagnósticos",
          estado: "A",
          solicitanteId: 12345678,
          solicitante: {
            nombre_completo: "John Doe"
          }
        }
      ]
    }
  })
  @ApiBearerAuth()
  async getMisSolicitudes(@Request() req) {
    return this.solicitudService.getSolicitudesByPaciente(req.user.cedula);
  }

  @Get('solicitudes-abiertas')
  @Roles(Role.Administrador)
  @ApiOperation({ summary: 'Obtener todas las solicitudes abiertas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de solicitudes abiertas',
    schema: {
      example: [
        {
          id: 2,
          titulo: 'Inconsistencia de datos',
          tipo: 'inconsistencia de datos',
          descripcion: 'Datos erróneos en el perfil del usuario',
          fechaReporte: '2024-10-30T10:00:00Z',
          solicitante: { nombre_completo: 'Maria López', correo_electronico: 'maria.lopez@example.com' },
          estado: 'A',
        }
      ]
    }
  })
  @ApiBearerAuth()
  async getOpenSolicitudes() {
    return this.solicitudService.getOpenSolicitudes();
  }
}

