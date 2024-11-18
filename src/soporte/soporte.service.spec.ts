import { Test, TestingModule } from '@nestjs/testing';
import { SoporteService } from './soporte.service';
import { SolicitudRepository } from './repository/solicitud.repository';
import { BadRequestException } from '@nestjs/common';

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
    it('should return a solicitud if it exists', async () => {
      const solicitudId = 1;
      const mockSolicitud = { id: solicitudId, titulo: 'Solicitud 1' };
      mockSolicitudRepository.findById.mockResolvedValue(mockSolicitud);

      const result = await service.getSolicitudById(solicitudId);

      expect(solicitudRepository.findById).toHaveBeenCalledWith(solicitudId);
      expect(result).toEqual(mockSolicitud);
    });

    it('should throw an exception if the solicitud does not exist', async () => {
      const solicitudId = 999;
      mockSolicitudRepository.findById.mockResolvedValue(null);

      await expect(service.getSolicitudById(solicitudId)).rejects.toThrow(
        new BadRequestException('Solicitud no encontrada'),
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