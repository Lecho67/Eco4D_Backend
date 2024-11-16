import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { MensajesService } from './mensajes.service';
import { Roles } from 'src/usuarios/roles/roles.decorator';
import { Role } from 'src/usuarios/roles/roles.enum';
import { RolesGuard } from 'src/usuarios/roles/roles.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
@Controller('mensajes')
export class MensajesController {
    constructor(private readonly mensajesService: MensajesService){}
    @UseGuards(AuthGuard,RolesGuard)
    @Roles(Role.Administrador,Role.Paciente)
    @Post('/nuevo')

    @ApiOperation({ summary: 'Crear un nuevo mensaje en una solicitud de soporte' })
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          descripcion: { type: 'string', description: 'Descripción del mensaje' },
          solicitudId: { type: 'number', description: 'ID de la solicitud a la que se asocia el mensaje' },
        },
        required: ['descripcion', 'solicitudId'],
      },
    })
    @ApiResponse({ status: 201, description: 'Mensaje creado exitosamente.' })
    @ApiResponse({ status: 403, description: 'No tienes permiso para enviar mensajes en esta solicitud.' })
    @ApiResponse({ status: 400, description: 'Solicitud no encontrada o datos inválidos.' })
    async nuevoMensaje(@Body() {descripcion,solicitudId}, @Request() req){
        return await this.mensajesService.nuevoMensaje(descripcion,solicitudId,req.user);
    }
}
