import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AzureBlobService } from 'src/azure-blob-service/AzureBlob.service';
import { CreateDiagnosticoDto } from './dto/create-diagnosticos.dto';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

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
      // Subir archivos a Azure y obtener los nombres de archivo
      let videoName: string, imagenName: string;

      try {
        [videoName, imagenName] = await Promise.all([
          this.azureBlobService.upload(video),
          this.azureBlobService.upload(imagen)
        ]);
      } catch (uploadError) {
        throw new BadRequestException(`Error al subir archivos: ${uploadError.message}`);
      }

      // Validar que los nombres de archivo se obtuvieron correctamente
      if (!videoName || !imagenName) {
        throw new BadRequestException('Error al procesar los archivos subidos');
      }

      // Crear el diagnóstico con los nombres de los archivos (no los buffers)
      const diagnostico = await this.prisma.diagnostico.create({
        data: {
          descripcion: createDiagnosticoDto.descripcion.replace(/\0/g, ''),
          edadGestacional: createDiagnosticoDto.edadGestacional,
          enlaceFoto: imagenName.replace(/\0/g, ''), // Asegurarse de que no hay espacios en blanco
          enlaceVideo: videoName.replace(/\0/g, ''), // Asegurarse de que no hay espacios en blanco
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

      // Generar URLs seguras para acceder a los archivos
      const secureImageUrl = this.azureBlobService.generateSasUrl(imagenName);
      const secureVideoUrl = this.azureBlobService.generateSasUrl(videoName);

      // Retornar el diagnóstico con las URLs seguras
      return {
        ...diagnostico,
        enlaceFoto: secureImageUrl,
        enlaceVideo: secureVideoUrl,
        message: 'Diagnóstico creado exitosamente',
      };
    } catch (error) {
      // Log del error para debugging
      console.error('Error completo:', error);
      
      throw new BadRequestException(
        'Error al crear el diagnóstico: ' + (error.message || 'Error desconocido')
      );
    }
  }

  async getSecureUrl(diagnosticoId: number, userId: number) {
    const diagnostico = await this.prisma.diagnostico.findUnique({
      where: { id: diagnosticoId },
      include: {
        medico: true,
        paciente: true,
      },
    });

    if (!diagnostico) {
      throw new NotFoundException('Diagnóstico no encontrado');
    }

    // Verificar si el usuario tiene acceso
    if (diagnostico.medicoId !== userId && diagnostico.pacienteId !== userId) {
      throw new ForbiddenException('No tiene acceso a este recurso');
    }

    // Generar URLs temporales
    const secureImageUrl = this.azureBlobService.generateSasUrl(diagnostico.enlaceFoto);
    const secureVideoUrl = this.azureBlobService.generateSasUrl(diagnostico.enlaceVideo);

    return {
      imageUrl: secureImageUrl,
      videoUrl: secureVideoUrl,
    };
  }

  private calculateAge(birthDate: Date): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  private async generateSecureUrls(diagnostico: any) {
    const secureImageUrl = this.azureBlobService.generateSasUrl(diagnostico.enlaceFoto);
    const secureVideoUrl = this.azureBlobService.generateSasUrl(diagnostico.enlaceVideo);
    return {
      ...diagnostico,
      enlaceFoto: secureImageUrl,
      enlaceVideo: secureVideoUrl,
    };
  }

  async getDiagnosticosByMedico(medicoId: number) {
    const diagnosticos = await this.prisma.diagnostico.findMany({
      where: {
        medicoId: medicoId,
      },
      include: {
        paciente: {
          select: {
            nombre_completo: true,
            fecha_nacimiento: true,
            correo_electronico: true,
          },
        },
      },
      orderBy: {
        fecha: 'desc',
      },
    });

    // Procesar cada diagnóstico para incluir solo la edad
    return diagnosticos.map(diagnostico => ({
      ...diagnostico,
      paciente: {
        ...diagnostico.paciente,
        edad: this.calculateAge(diagnostico.paciente.fecha_nacimiento),
      },
    }));
  }

  async getDiagnosticosByPaciente(pacienteId: number, userRole: string) {
    const diagnosticos = await this.prisma.diagnostico.findMany({
      where: {
        pacienteId: pacienteId,
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
            fecha_nacimiento: true,
          },
        },
      },
      orderBy: {
        fecha: 'desc',
      },
    });

    // Procesar cada diagnóstico para incluir solo la edad
    return diagnosticos.map(diagnostico => ({
      ...diagnostico,
      edad_paciente: this.calculateAge(diagnostico.paciente.fecha_nacimiento),
    }));
  }
 
  async getDiagnosticoById(diagnosticoId: number, userId: number, userRole: string) {
    const diagnostico = await this.prisma.diagnostico.findUnique({
      where: {
        id: diagnosticoId,
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
            fecha_nacimiento: true,
          },
        },
      },
    });

    if (!diagnostico) {
      throw new NotFoundException('Diagnóstico no encontrado');
    }

    // Verificar acceso: solo el médico que lo creó o el paciente asociado pueden verlo
    if (diagnostico.medicoId !== userId && diagnostico.pacienteId !== userId) {
      throw new ForbiddenException('No tiene acceso a este diagnóstico');
    }

    // Generar URLs seguras
    const processedDiagnostico = await this.generateSecureUrls(diagnostico);

    // Preparar la respuesta según el rol del usuario
    if (userRole === 'M') {
      return {
        ...processedDiagnostico,
        paciente: {
          ...processedDiagnostico.paciente,
          edad: this.calculateAge(processedDiagnostico.paciente.fecha_nacimiento),
        },
      };
    } else {
      return {
        ...processedDiagnostico,
        edad_paciente: this.calculateAge(processedDiagnostico.paciente.fecha_nacimiento),
      };
    }
  }  

  @ApiOperation({ summary: 'Calificar diagnóstico' })
  @ApiParam({ name: 'id', description: 'ID del diagnóstico', type: Number })
  @ApiParam({ name: 'calificacion', description: 'Calificación para el diagnóstico (1-5)', type: Number })
  @ApiResponse({ status: 200, description: 'Diagnóstico calificado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Diagnóstico no encontrado.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  async calificarDiagnostico(diagnosticoId: number, calificacion: number, userId: number) {
    const diagnostico = await this.prisma.diagnostico.findFirst({
      where:{ AND: [{ id: diagnosticoId }, { pacienteId: userId }] }
    });

    if (!diagnostico) {
      throw new NotFoundException('Diagnóstico no encontrado');
    }

    return this.prisma.diagnostico.update({
      where: { id: diagnosticoId },
      data: { calificacion },
    });
  }
}