import {  Controller, Get, Put, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { Roles } from './roles/roles.decorator';
import { Role } from './roles/roles.enum';
import { RolesGuard } from './roles/roles.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
@Controller('usuarios')
export class UsuariosController {
    constructor(private readonly usuariosService: UsuariosService){}
    // Ejemplo de como se crean las rutas por roles
    @Get('/administradores')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Administrador)
    @ApiOperation({ summary: 'Obtener lista de administradores' })
    @ApiResponse({ status: 200, description: 'Lista de administradores obtenida exitosamente.' })
    @ApiResponse({ status: 403, description: 'Acceso denegado.' })
    getAdmin() {
      return this.usuariosService.getAdministradores();
    }
  
    // Obtener todos los médicos
    @Get('/medicos')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Administrador)
    @ApiOperation({ summary: 'Obtener lista de médicos' })
    @ApiResponse({ status: 200, description: 'Lista de médicos obtenida exitosamente.' })
    @ApiResponse({ status: 403, description: 'Acceso denegado.' })
    getMedico() {
      return this.usuariosService.getMedicos();
    }
  
    // Obtener todos los pacientes
    @Get('/pacientes')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Administrador,Role.Medico)
    @ApiOperation({ summary: 'Obtener lista de pacientes' })
    @ApiResponse({ status: 200, description: 'Lista de pacientes obtenida exitosamente.' })
    @ApiResponse({ status: 403, description: 'Acceso denegado.' })

    getPaciente() {
      return this.usuariosService.getPacientes();
    }

    @Get('')
    @UseGuards(AuthGuard, RolesGuard)
    @ApiOperation({ summary: 'Obtener información de un usuario por ID' })
    @ApiResponse({ status: 200, description: 'Información del usuario obtenida exitosamente.' })
    getUserById(@Request() req) {
      return this.usuariosService.getUserById(req.user.identificacion);
    }

    @Put('/foto')
    @UseGuards(AuthGuard, RolesGuard)
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({ summary: 'Subir foto de perfil' })
    @ApiResponse({ status: 200, description: 'Foto de perfil subida exitosamente.' })
    @ApiResponse({ status: 403, description: 'Acceso denegado.' })
    anadirFoto(@Request() req, @UploadedFile() file: Express.Multer.File) {
      return this.usuariosService.añadirFoto(req.user.identificacion, file);
    }

}
