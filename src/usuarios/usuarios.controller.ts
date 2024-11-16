import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { Roles } from './roles/roles.decorator';
import { Role } from './roles/roles.enum';
import { RolesGuard } from './roles/roles.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
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
    @Roles(Role.Administrador)
    @ApiOperation({ summary: 'Obtener lista de pacientes' })
    @ApiResponse({ status: 200, description: 'Lista de pacientes obtenida exitosamente.' })
    @ApiResponse({ status: 403, description: 'Acceso denegado.' })

    getPaciente() {
      return this.usuariosService.getPacientes();
    }
}
