import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Usuario } from '../interfaces/Usuario';
import { IUserRepository } from '../interfaces/UserRepository'; 

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

  async create(user: Usuario): Promise<Usuario> {
    return this.prisma.usuario.create({
      data: user as any, // El 'as any' es necesario debido a la estructura de Prisma
    });
  }

  async update(id: number, user: Partial<Usuario>): Promise<Usuario> {
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