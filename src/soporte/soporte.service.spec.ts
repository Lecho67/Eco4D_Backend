import { Test, TestingModule } from '@nestjs/testing';
import { SoporteService } from './soporte.service';
import { SolicitudRepository } from './repository/solicitud.repository';
import { BadRequestException, ForbiddenException } from '@nestjs/common';

describe('SoporteService', () => {
  let service: SoporteService;
  let solicitudRepository: SolicitudRepository;

  const mockSolicitudRepository = {
    create: jest.fn(),
    findAllByPaciente: jest.fn(),
    findAllOpenSolicitudes: jest.fn(),
    findById: jest.fn(),
    añadirFechaSolucion: jest.fn(),
  };

  const mockUser = {
    identificacion: 627950443,
    tipoIdentificacion: "CC",
    nombre_completo: "Alejandro",
    correo_electronico: "paciente1@example.com",
    rol: "P",
    pais: "Colombia",
    ciudad: "Bogotá",
    fecha_nacimiento: "1990-01-01T00:00:00.000Z",
    url_foto_de_perfil: "https://eco4dimg.blob.core.windows.net/public-eco4d/ecografia-y.ultrasonido-1732048054844.jpg"
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SoporteService,
        {
          provide: SolicitudRepository,
          useValue: mockSolicitudRepository,
        },
      ],
    }).compile();

    service = module.get<SoporteService>(SoporteService);
    solicitudRepository = module.get<SolicitudRepository>(SolicitudRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createSolicitud', () => {
    it('should create a new solicitud', async () => {
      const mockCreateSolicitudDto = {
        titulo: 'Error en el sistema',
        tipo: 'fallas tecnicas',
        descripcion: 'La aplicación se cierra al guardar un documento',
      };
      const mockResult = { id: 1, ...mockCreateSolicitudDto, estado: 'A', solicitanteId: 10 };
      mockSolicitudRepository.create.mockResolvedValue(mockResult);

      const result = await service.createSolicitud(mockCreateSolicitudDto, 10);

      expect(solicitudRepository.create).toHaveBeenCalledWith(mockCreateSolicitudDto, 10);
      expect(result).toEqual(mockResult);
    });
  });

  describe('getSolicitudesByPaciente', () => {
    it('should return solicitudes for a given paciente', async () => {
      const pacienteId = 1;
      const mockSolicitudes = [
        { id: 1, titulo: 'Solicitud 1', solicitanteId: pacienteId },
        { id: 2, titulo: 'Solicitud 2', solicitanteId: pacienteId },
      ];
      mockSolicitudRepository.findAllByPaciente.mockResolvedValue(mockSolicitudes);

      const result = await service.getSolicitudesByPaciente(pacienteId);

      expect(solicitudRepository.findAllByPaciente).toHaveBeenCalledWith(pacienteId);
      expect(result).toEqual(mockSolicitudes);
    });
  });

  describe('getOpenSolicitudes', () => {
    it('should return all open solicitudes', async () => {
      const mockOpenSolicitudes = [
        { id: 1, titulo: 'Solicitud 1', estado: 'A' },
        { id: 2, titulo: 'Solicitud 2', estado: 'A' },
      ];
      mockSolicitudRepository.findAllOpenSolicitudes.mockResolvedValue(mockOpenSolicitudes);

      const result = await service.getOpenSolicitudes();

      expect(solicitudRepository.findAllOpenSolicitudes).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockOpenSolicitudes);
    });
  });

  describe('getSolicitudById', () => {
    it('should return a solicitud if the user is the solicitante', async () => {
      const solicitudId = 1;
      const mockSolicitud = { 
        id: solicitudId, 
        titulo: 'Solicitud 1', 
        solicitanteId: mockUser.identificacion 
      };
      mockSolicitudRepository.findById.mockResolvedValue(mockSolicitud);

      const result = await service.getSolicitudById(solicitudId, mockUser);

      expect(solicitudRepository.findById).toHaveBeenCalledWith(solicitudId);
      expect(result).toEqual(mockSolicitud);
    });

    it('should return a solicitud if the user is an administrator', async () => {
      const solicitudId = 1;
      const adminUser = { ...mockUser, rol: 'A' };
      const mockSolicitud = { 
        id: solicitudId, 
        titulo: 'Solicitud 1', 
        solicitanteId: 999 
      };
      mockSolicitudRepository.findById.mockResolvedValue(mockSolicitud);

      const result = await service.getSolicitudById(solicitudId, adminUser);

      expect(solicitudRepository.findById).toHaveBeenCalledWith(solicitudId);
      expect(result).toEqual(mockSolicitud);
    });

    it('should throw a ForbiddenException if the user is not the solicitante or an admin', async () => {
      const solicitudId = 1;
      const otherUser = { ...mockUser, identificacion: 999 };
      const mockSolicitud = { 
        id: solicitudId, 
        titulo: 'Solicitud 1', 
        solicitanteId: 627950443 
      };
      mockSolicitudRepository.findById.mockResolvedValue(mockSolicitud);

      await expect(service.getSolicitudById(solicitudId, otherUser)).rejects.toThrow(
        new ForbiddenException('No tienes permiso para acceder a esta solicitud')
      );

      expect(solicitudRepository.findById).toHaveBeenCalledWith(solicitudId);
    });

    it('should throw a BadRequestException if the solicitud does not exist', async () => {
      const solicitudId = 999;
      mockSolicitudRepository.findById.mockResolvedValue(null);

      await expect(service.getSolicitudById(solicitudId, mockUser)).rejects.toThrow(
        new BadRequestException('Solicitud no encontrada')
      );

      expect(solicitudRepository.findById).toHaveBeenCalledWith(solicitudId);
    });
  });

  describe('añadirFechaSolucion', () => {
    it('should update the solicitud with fechaSolucion', async () => {
      const solicitudId = 1;
      const mockUpdatedSolicitud = { id: solicitudId, estado: 'R', fechaSolucion: new Date() };
      mockSolicitudRepository.añadirFechaSolucion.mockResolvedValue(mockUpdatedSolicitud);

      const result = await service.añadirFechaSolucion(solicitudId);

      expect(solicitudRepository.añadirFechaSolucion).toHaveBeenCalledWith(solicitudId);
      expect(result).toEqual(mockUpdatedSolicitud);
    });
  });
});