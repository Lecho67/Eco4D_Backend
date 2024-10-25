import { Module } from '@nestjs/common';
import { UsuariosModule } from './usuarios/usuarios.module';
import { DiagnosticosModule } from './diagnosticos/diagnosticos.module';
import { SoporteModule } from './soporte/soporte.module';
import { MensajesModule } from './mensajes/mensajes.module';


@Module({
  imports: [UsuariosModule, DiagnosticosModule, SoporteModule, MensajesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
