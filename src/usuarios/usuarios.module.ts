import { Module } from '@nestjs/common';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { PrismaService } from 'src/prisma.service';
import { UserRepository } from './respositorios/UsersRepository';
import { JwtService } from '@nestjs/jwt';
import { AzureBlobService } from 'src/azure-blob-service/AzureBlob.service';
import { VideoConverterService } from 'src/video-converter/video-converter.service';
@Module({
  controllers: [UsuariosController],
  providers: [UsuariosService,PrismaService,UserRepository,JwtService, AzureBlobService,VideoConverterService],
  exports: [UserRepository]
})
export class UsuariosModule {}
