import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsuariosService {
    constructor(private readonly prisma: PrismaService) {}

    getUsers() {
        return this.prisma.usuario.findMany();
    }

}
