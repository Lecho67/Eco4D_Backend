import { Module } from '@nestjs/common';
import { SoporteController } from './soporte.controller';
import { SoporteService } from './soporte.service';
import { SolicitudRepository } from './repository/solicitud.repository';
import { PrismaService } from 'src/prisma.service';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [AuthModule],
  controllers: [SoporteController],
  providers: [SoporteService,SolicitudRepository,PrismaService,JwtService]
})
export class SoporteModule {}
