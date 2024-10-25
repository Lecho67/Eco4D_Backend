import { Module } from '@nestjs/common';
import { UsuariosController } from './usuarios.controller';

@Module({
  controllers: [UsuariosController]
})
export class UsuariosModule {}
