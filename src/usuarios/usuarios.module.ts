import { Module } from '@nestjs/common';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { PrismaService } from 'src/prisma.service';
import { UserRepository } from './respositorios/UsersRepository';
import { JwtService } from '@nestjs/jwt';
@Module({
  controllers: [UsuariosController],
  providers: [UsuariosService,PrismaService,UserRepository,JwtService],
  exports: [UserRepository]
})
export class UsuariosModule {}
