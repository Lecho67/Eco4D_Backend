import { Injectable } from '@nestjs/common';
import { UserRepository } from './respositorios/UsersRepository';
@Injectable()
export class UsuariosService {
    constructor(private readonly repositorioUsuario: UserRepository) {}

    getPacientes() {
        return this.repositorioUsuario.getPacientes();
    }

    getMedicos() {
        return this.repositorioUsuario.getMedicos();
    }

    getAdministradores() {
        return this.repositorioUsuario.getAdministradores();
    }
}
