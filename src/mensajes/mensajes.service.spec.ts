import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { MensajesService } from './mensajes.service';
import { PrismaService } from '../prisma.service';

describe('MensajesService', () => {
  let service: MensajesService;
  let prisma: PrismaService;

  const mockPrismaService = {
    solicitudSoporte: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
    },
    mensaje: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MensajesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<MensajesService>(MensajesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('nuevoMensaje', () => {
    it('should create a new mensaje if user is allowed', async () => {
      const descripcion = 'Nuevo mensaje de prueba';
      const solicitudId = 1;
      const user = { identificacion: 123, rol: 'P' };

      mockPrismaService.solicitudSoporte.findFirst.mockResolvedValue({ id: solicitudId });
      mockPrismaService.mensaje.create.mockResolvedValue({
        id: 1,
        descripcion,
        autorId: user.identificacion,
        solicitudId,
      });

      const result = await service.nuevoMensaje(descripcion, solicitudId, user);

      expect(prisma.solicitudSoporte.findFirst).toHaveBeenCalledWith({
        where: { id: solicitudId, solicitanteId: user.identificacion },
      });
      expect(prisma.mensaje.create).toHaveBeenCalledWith({
        data: {
          descripcion,
          autorId: user.identificacion,
          solicitudId,
        },
      });
      expect(result).toEqual({
        id: 1,
        descripcion,
        autorId: user.identificacion,
        solicitudId,
      });
    });

    it('should throw ForbiddenException if user is not allowed', async () => {
      const descripcion = 'Mensaje no autorizado';
      const solicitudId = 1;
      const user = { identificacion: 123, rol: 'P' };

      mockPrismaService.solicitudSoporte.findFirst.mockResolvedValue(null);

      await expect(
        service.nuevoMensaje(descripcion, solicitudId, user),
      ).rejects.toThrow(ForbiddenException);

      expect(prisma.solicitudSoporte.findFirst).toHaveBeenCalledWith({
        where: { id: solicitudId, solicitanteId: user.identificacion },
      });
      expect(prisma.mensaje.create).not.toHaveBeenCalled();
    });
  });

  describe('obtenerMensajes', () => {
    it('should return mensajes if user is authorized', async () => {
      const solicitudId = 1;
      const usuario = { identificacion: 123, rol: 'A' };

      mockPrismaService.solicitudSoporte.findUnique.mockResolvedValue({
        solicitanteId: 123,
      });

      const mockMensajes = [
        { id: 1, descripcion: 'Mensaje 1', autor: { nombre_completo: 'Autor 1' } },
        { id: 2, descripcion: 'Mensaje 2', autor: { nombre_completo: 'Autor 2' } },
      ];

      mockPrismaService.mensaje.findMany.mockResolvedValue(mockMensajes);

      const result = await service.obtenerMensajes(solicitudId, usuario);

      expect(prisma.solicitudSoporte.findUnique).toHaveBeenCalledWith({
        where: { id: solicitudId },
        select: { solicitanteId: true },
      });
      expect(prisma.mensaje.findMany).toHaveBeenCalledWith({
        where: { solicitudId },
        include: { autor: { select: { nombre_completo: true } } },
      });
      expect(result).toEqual(mockMensajes);
    });

    it('should throw NotFoundException if solicitud does not exist', async () => {
      const solicitudId = 1;
      const usuario = { identificacion: 123, rol: 'A' };

      mockPrismaService.solicitudSoporte.findUnique.mockResolvedValue(null);

      await expect(service.obtenerMensajes(solicitudId, usuario)).rejects.toThrow(
        NotFoundException,
      );

      expect(prisma.solicitudSoporte.findUnique).toHaveBeenCalledWith({
        where: { id: solicitudId },
        select: { solicitanteId: true },
      });
      expect(prisma.mensaje.findMany).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException if user is not authorized', async () => {
      const solicitudId = 1;
      const usuario = { identificacion: 456, rol: 'P' };

      mockPrismaService.solicitudSoporte.findUnique.mockResolvedValue({
        solicitanteId: 123,
      });

      await expect(service.obtenerMensajes(solicitudId, usuario)).rejects.toThrow(
        ForbiddenException,
      );

      expect(prisma.solicitudSoporte.findUnique).toHaveBeenCalledWith({
        where: { id: solicitudId },
        select: { solicitanteId: true },
      });
      expect(prisma.mensaje.findMany).not.toHaveBeenCalled();
    });
  });
});