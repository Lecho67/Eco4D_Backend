import { Test, TestingModule } from '@nestjs/testing';
import { DiagnosticoService } from './diagnostico.service';
import { PrismaService } from '../prisma.service';
import { AzureBlobService } from '../azure-blob-service/AzureBlob.service';
import { BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';

describe('DiagnosticoService', () => {
  let service: DiagnosticoService;
  let prismaService: PrismaService;
  let azureBlobService: AzureBlobService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiagnosticoService,
        {
          provide: PrismaService,
          useValue: {
            usuario: {
              findUnique: jest.fn(),
            },
            diagnostico: {
              create: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
            },
          },
        },
        {
          provide: AzureBlobService,
          useValue: {
            upload: jest.fn(),
            generateSasUrl: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(DiagnosticoService);
    prismaService = module.get(PrismaService);
    azureBlobService = module.get(AzureBlobService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a diagnostico successfully', async () => {
      // Arrange
      const createDiagnosticoDto = {
        descripcion: 'Test description',
        edadGestacional: 30,
        pacienteId: 123,
        calificacion: 5,
      };
      const video = { filename: 'video.mp4' } as Express.Multer.File;
      const imagen = { filename: 'image.jpg' } as Express.Multer.File;
      const medicoId = 1;
      
      const medico = { identificacion: 1, rol: 'M' };
      const paciente = { identificacion: 123, rol: 'P' };
      const videoName = 'videoName.mp4';
      const imagenName = 'imageName.jpg';
      const secureVideoUrl = 'https://secureVideoUrl.com';
      const secureImageUrl = 'https://secureImageUrl.com';

      prismaService.usuario.findUnique = jest.fn()
        .mockImplementation((args) => {
          if (args.where.identificacion === medicoId) return medico;
          if (args.where.identificacion === createDiagnosticoDto.pacienteId) return paciente;
        });

      azureBlobService.upload = jest.fn()
        .mockResolvedValueOnce(videoName)
        .mockResolvedValueOnce(imagenName);

      azureBlobService.generateSasUrl = jest.fn()
        .mockReturnValueOnce(secureImageUrl)
        .mockReturnValueOnce(secureVideoUrl);

      prismaService.diagnostico.create = jest.fn().mockResolvedValue({
        descripcion: createDiagnosticoDto.descripcion,
        edadGestacional: createDiagnosticoDto.edadGestacional,
        enlaceFoto: imagenName,
        enlaceVideo: videoName,
        calificacion: createDiagnosticoDto.calificacion,
        medicoId: medicoId,
        pacienteId: createDiagnosticoDto.pacienteId,
        medico: { nombre_completo: 'Dr. Test', correo_electronico: 'drtest@example.com' },
        paciente: { nombre_completo: 'Paciente Test', correo_electronico: 'paciente@example.com' },
      });

      // Act
      const result = await service.create(createDiagnosticoDto, video, imagen, medicoId);

      // Assert
      expect(result.message).toBe('Diagnóstico creado exitosamente');
      expect(result.enlaceFoto).toBe(secureImageUrl);
      expect(result.enlaceVideo).toBe(secureVideoUrl);
    });

    it('should throw NotFoundException if medico is not found', async () => {
      // Arrange
      const createDiagnosticoDto = { descripcion: 'Test description', edadGestacional: 30, pacienteId: 123, calificacion: 5 };
      const video = { filename: 'video.mp4' } as Express.Multer.File;
      const imagen = { filename: 'image.jpg' } as Express.Multer.File;
      const medicoId = 999;

      prismaService.usuario.findUnique = jest.fn().mockResolvedValueOnce(null);

      // Act & Assert
      await expect(service.create(createDiagnosticoDto, video, imagen, medicoId))
        .rejects
        .toThrow(new NotFoundException('Médico no encontrado'));
    });

    it('should throw ForbiddenException if medico has incorrect role', async () => {
      // Arrange
      const createDiagnosticoDto = { descripcion: 'Test description', edadGestacional: 30, pacienteId: 123, calificacion: 5 };
      const video = { filename: 'video.mp4' } as Express.Multer.File;
      const imagen = { filename: 'image.jpg' } as Express.Multer.File;
      const medicoId = 1;
      const medico = { identificacion: 1, rol: 'A' }; // Role not 'M'

      prismaService.usuario.findUnique = jest.fn().mockResolvedValueOnce(medico);

      // Act & Assert
      await expect(service.create(createDiagnosticoDto, video, imagen, medicoId))
        .rejects
        .toThrow(new ForbiddenException('El usuario no tiene permisos de médico'));
    });

    it('should throw NotFoundException if paciente is not found', async () => {
      // Arrange
      const createDiagnosticoDto = { descripcion: 'Test description', edadGestacional: 30, pacienteId: 123, calificacion: 5 };
      const video = { filename: 'video.mp4' } as Express.Multer.File;
      const imagen = { filename: 'image.jpg' } as Express.Multer.File;
      const medicoId = 1;
      const medico = { identificacion: 1, rol: 'M' };
      const paciente = null; // Patient does not exist

      prismaService.usuario.findUnique = jest.fn()
        .mockResolvedValueOnce(medico)
        .mockResolvedValueOnce(paciente);

      // Act & Assert
      await expect(service.create(createDiagnosticoDto, video, imagen, medicoId))
        .rejects
        .toThrow(new NotFoundException('Paciente no encontrado'));
    });

    it('should throw BadRequestException if file upload fails', async () => {
      // Arrange
      const createDiagnosticoDto = { descripcion: 'Test description', edadGestacional: 30, pacienteId: 123, calificacion: 5 };
      const video = { filename: 'video.mp4' } as Express.Multer.File;
      const imagen = { filename: 'image.jpg' } as Express.Multer.File;
      const medicoId = 1;

      const medico = { identificacion: 1, rol: 'M' };
      const paciente = { identificacion: 123, rol: 'P' };

      prismaService.usuario.findUnique = jest.fn()
        .mockImplementation((args) => {
          if (args.where.identificacion === medicoId) return medico;
          if (args.where.identificacion === createDiagnosticoDto.pacienteId) return paciente;
        });

      azureBlobService.upload = jest.fn().mockRejectedValueOnce(new Error('Upload failed'));

      // Act & Assert
      await expect(service.create(createDiagnosticoDto, video, imagen, medicoId))
        .rejects
        .toThrow(new BadRequestException('Error al crear el diagnóstico: Error al subir archivos: Upload failed'));
    });
  });
});