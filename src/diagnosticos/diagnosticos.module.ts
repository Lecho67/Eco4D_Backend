import { Module } from '@nestjs/common';
import { DiagnosticoController } from './diagnostico.controller';
import { DiagnosticoService } from './diagnostico.service';
import { PrismaService } from 'src/prisma.service';
import { AzureBlobService } from 'src/azure-blob-service/AzureBlob.service';
import { JwtService } from '@nestjs/jwt';
import { VideoConverterService } from 'src/video-converter/video-converter.service';
@Module({
  controllers: [DiagnosticoController],
  providers: [DiagnosticoService,PrismaService,AzureBlobService,JwtService,VideoConverterService]
})
export class DiagnosticosModule {}
