import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosService } from './usuarios.service';
import { UserRepository } from './respositorios/UsersRepository';

describe('UsuariosService', () => {
  let service: UsuariosService;
  let userRepository: UserRepository;

  const mockUserRepository = {
    getPacientes: jest.fn(),
    getMedicos: jest.fn(),
    getAdministradores: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuariosService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsuariosService>(UsuariosService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Limpia los mocks después de cada prueba
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPacientes', () => {
    it('should return a list of patients', async () => {
      const mockPacientes = [
        { identificacion: 1, nombre_completo: 'John Doe', rol: 'P' },
        { identificacion: 2, nombre_completo: 'Jane Doe', rol: 'P' },
      ];
      mockUserRepository.getPacientes.mockResolvedValue(mockPacientes);

      const result = await service.getPacientes();

      expect(userRepository.getPacientes).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockPacientes);
    });
  });

  describe('getMedicos', () => {
    it('should return a list of doctors', async () => {
      const mockMedicos = [
        { identificacion: 3, nombre_completo: 'Dr. Smith', rol: 'M' },
      ];
      mockUserRepository.getMedicos.mockResolvedValue(mockMedicos);

      const result = await service.getMedicos();

      expect(userRepository.getMedicos).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockMedicos);
    });
  });

  describe('getAdministradores', () => {
    it('should return a list of administrators', async () => {
      const mockAdministradores = [
        { identificacion: 4, nombre_completo: 'Admin One', rol: 'A' },
      ];
      mockUserRepository.getAdministradores.mockResolvedValue(mockAdministradores);

      const result = await service.getAdministradores();

      expect(userRepository.getAdministradores).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockAdministradores);
    });
  });
});