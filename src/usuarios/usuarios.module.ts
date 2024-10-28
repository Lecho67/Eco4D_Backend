import { Module } from '@nestjs/common';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { PrismaService } from 'src/prisma.service';
import { UserRepository } from './respositorios/UsersRepository';
@Module({
  controllers: [UsuariosController],
  providers: [UsuariosService,PrismaService,UserRepository],
  exports: [UserRepository]
})
export class UsuariosModule {}
