import { Injectable, ConflictException} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Usuario } from '../interfaces/Usuario';
import { CreateUserDto } from '../dto/createuser.dto';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return this.prisma.usuario.create({
      data: {
        identificacion: createUserDto.identificacion,
        tipoIdentificacion: createUserDto.tipoIdentificacion,
        nombre_completo: createUserDto.nombre_completo,
        correo_electronico: createUserDto.correo_electronico,
        contrasena: createUserDto.contrasena,
        rol: createUserDto.rol || 'P',
        pais: createUserDto.pais,
        ciudad: createUserDto.ciudad,
        fecha_nacimiento: createUserDto.fecha_nacimiento,
      },
    });
  }

  async findById(id: number) {
    return this.prisma.usuario.findUnique({
      where: { identificacion: id },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.usuario.findUnique({
      where: { correo_electronico: email },
    });
  }

  async update(id: number, data: Partial<Usuario>) {
    return this.prisma.usuario.update({
      where: { identificacion: id },
      data,
    });
  }

  async delete(id: number) {
    await this.prisma.usuario.delete({
      where: { identificacion: id },
    });
  }
}