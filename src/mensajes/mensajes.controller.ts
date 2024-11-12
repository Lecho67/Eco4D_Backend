import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { MensajesService } from './mensajes.service';
import { Roles } from 'src/usuarios/roles/roles.decorator';
import { Role } from 'src/usuarios/roles/roles.enum';
import { RolesGuard } from 'src/usuarios/roles/roles.guard';
import { AuthGuard } from 'src/auth/auth.guard';
@Controller('mensajes')
export class MensajesController {
    constructor(private readonly mensajesService: MensajesService){}
    @UseGuards(RolesGuard,AuthGuard)
    @Roles(Role.Administrador,Role.Paciente)
    @Post('/nuevo')
    async nuevoMensaje(@Body() {descripcion,solicitudId}, @Request() req){
        return await this.mensajesService.nuevoMensaje(descripcion,solicitudId,req.user);
    }
}
