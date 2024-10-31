import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { Roles } from './roles/roles.decorator';
import { Role } from './roles/roles.enum';
import { RolesGuard } from './roles/roles.guard';
import { AuthGuard } from 'src/auth/auth.guard';
@Controller('usuarios')
export class UsuariosController {
    constructor(private readonly usuariosService: UsuariosService){}
    // Ejemplo de como se crean las rutas por roles
    @Get('/admin')
    @UseGuards(AuthGuard,RolesGuard)
    @Roles(Role.Administrador)
    getAdminThings(): string {
        return 'AdminThings';

    }
    

}
