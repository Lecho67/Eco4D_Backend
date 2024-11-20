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

    getUserById(id: number) {
        return this.repositorioUsuario.findByIdWhithoutPassword(id);
    }

    añadirFoto(id: number, file: Express.Multer.File) {
        return this.repositorioUsuario.añadirFoto(id, file);
    }

    update(id: number, user: Partial<any>) {
        return this.repositorioUsuario.update(id, user);
    }
}
