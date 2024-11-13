import { Module } from '@nestjs/common';
import { UsuariosModule } from './usuarios/usuarios.module';
import { DiagnosticosModule } from './diagnosticos/diagnosticos.module';
import { SoporteModule } from './soporte/soporte.module';
import { MensajesModule } from './mensajes/mensajes.module';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { AzureBlobService } from './azure-blob-service/AzureBlob.service';
import { ConfigModule } from '@nestjs/config';
import { VideoConverterService } from './video-converter/video-converter.service';

@Module({
  imports: [ ConfigModule.forRoot({
    isGlobal: true,
  }),UsuariosModule, DiagnosticosModule, SoporteModule, MensajesModule, AuthModule],
  controllers: [],
  providers: [PrismaService,JwtService, AzureBlobService, VideoConverterService],
})
export class AppModule {}
