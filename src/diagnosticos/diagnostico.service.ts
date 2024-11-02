import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AzureBlobService } from 'src/azure-blob-service/AzureBlob.service';
import { CreateDiagnosticoDto } from './dto/create-diagnosticos.dto';

@Injectable()
export class DiagnosticoService {
  constructor(
    private prisma: PrismaService,
    private azureBlobService: AzureBlobService,
  ) {}

  async create(
    createDiagnosticoDto: CreateDiagnosticoDto,
    video: Express.Multer.File,
    imagen: Express.Multer.File,
    medicoId: number,
  ) {
    // Verificar que el médico existe y tiene rol de médico
    const medico = await this.prisma.usuario.findUnique({
      where: { identificacion: medicoId }
    });

    if (!medico) {
      throw new NotFoundException('Médico no encontrado');
    }

    if (medico.rol !== 'M') {
      throw new ForbiddenException('El usuario no tiene permisos de médico');
    }

    // Verificar que el paciente existe y tiene rol de paciente
    const paciente = await this.prisma.usuario.findUnique({
      where: { identificacion: createDiagnosticoDto.pacienteId }
    });

    if (!paciente) {
      throw new NotFoundException('Paciente no encontrado');
    }

    if (paciente.rol !== 'P') {
      throw new BadRequestException('El usuario seleccionado no es un paciente');
    }

    try {
      // Subir ambos archivos a Azure Blob Storage
      const [videoUrl, imagenUrl] = await Promise.all([
        this.azureBlobService.upload(video),
        this.azureBlobService.upload(imagen)
      ]);

      // Crear el diagnóstico en la base de datos
      const diagnostico = await this.prisma.diagnostico.create({
        data: {
          descripcion: createDiagnosticoDto.descripcion,
          edadGestacional: createDiagnosticoDto.edadGestacional,
          enlaceFoto: imagenUrl,
          enlaceVideo: videoUrl,
          shareLink: createDiagnosticoDto.shareLink,
          calificacion: createDiagnosticoDto.calificacion,
          medicoId: medicoId,
          pacienteId: createDiagnosticoDto.pacienteId,
        },
        include: {
          medico: {
            select: {
              nombre_completo: true,
              correo_electronico: true,
            },
          },
          paciente: {
            select: {
              nombre_completo: true,
              correo_electronico: true,
            },
          },
        },
      });

      return {
        ...diagnostico,
        message: 'Diagnóstico creado exitosamente',
      };
    } catch (error) {
      throw new BadRequestException(
        'Error al crear el diagnóstico: ' + error.message
      );
    }
  }
}