import { Injectable, ConflictException} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Usuario } from '../interfaces/Usuario';
import { IUserRepository } from '../interfaces/UserRepository'; 
import { CreateUserDto } from '../dto/createuser.dto';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: number): Promise<Usuario> {
    return this.prisma.usuario.findUnique({
      where: { cedula: id },
    });
  }

  async findByEmail(email: string): Promise<Usuario> {
    return this.prisma.usuario.findFirst({
      where: { correo_electronico: email },
    });
  }

  async create(user: CreateUserDto): Promise<Usuario> {
    // Verificar si la cédula ya existe
    const existingUser = await this.prisma.usuario.findUnique({
      where: { cedula: user.cedula },
    });

    if (existingUser) {
      // Lanza una excepción si la cédula ya está registrada
      throw new ConflictException(`La cédula ${user.cedula} ya está en uso.`);
    }

    // Si la cédula es única, procede con la creación del usuario
    return this.prisma.usuario.create({
      data: user as any, // 'as any' se utiliza debido a la estructura de Prisma
    });
  }

  async update(id: number, user: Partial<CreateUserDto>): Promise<Usuario> {
    return this.prisma.usuario.update({
      where: { cedula: id },
      data: user,
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.usuario.delete({
      where: { cedula: id },
    });
  }
}