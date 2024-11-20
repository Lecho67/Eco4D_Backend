import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../usuarios/respositorios/UsersRepository';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('mockedHash123'),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: UserRepository;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mockAccessToken'),
          },
        },
        {
          provide: RefreshTokenRepository,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<UserRepository>(UserRepository);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should register a new user successfully', async () => {
    const mockRegisterDto = {
      identificacion: 12345678,
      tipoIdentificacion: 'CC',
      nombre_completo: 'John Doe',
      correo_electronico: 'johndoe@example.com',
      contrasena: 'password123',
      rol: 'P',
      pais: 'Colombia',
      ciudad: 'Bogotá',
      fecha_nacimiento: new Date('1990-01-01'),
      url_foto_de_perfil: null // Añadido con valor null
    };
    const mockResponse = {
      cookie: jest.fn(),
    } as any;

    const mockUser = { ...mockRegisterDto, contrasena: 'mockedHash123' };

    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);
    jest.spyOn(userRepository, 'create').mockResolvedValue(mockUser);

    const result = await authService.register(mockRegisterDto, mockResponse);

    expect(userRepository.findByEmail).toHaveBeenCalledWith(
      mockRegisterDto.correo_electronico,
    );
    expect(userRepository.create).toHaveBeenCalledWith({
      ...mockRegisterDto,
      contrasena: 'mockedHash123',
    });
    expect(mockResponse.cookie).toHaveBeenCalledTimes(2);
    expect(result).toEqual({
      user: {
        identificacion: mockRegisterDto.identificacion,
        tipoIdentificacion: mockRegisterDto.tipoIdentificacion,
        nombre_completo: mockRegisterDto.nombre_completo,
        correo_electronico: mockRegisterDto.correo_electronico,
        rol: mockRegisterDto.rol,
        pais: mockRegisterDto.pais,
        ciudad: mockRegisterDto.ciudad,
        fecha_nacimiento: mockRegisterDto.fecha_nacimiento,
        url_foto_de_perfil: null // Añadido en el resultado esperado
      },
    });
  });

  it('should throw an UnauthorizedException if user already exists during registration', async () => {
    const mockRegisterDto = {
      identificacion: 12345678,
      tipoIdentificacion: 'CC',
      nombre_completo: 'John Doe',
      correo_electronico: 'johndoe@example.com',
      contrasena: 'password123',
      rol: 'P',
      pais: 'Colombia',
      ciudad: 'Bogotá',
      fecha_nacimiento: new Date('1990-01-01'),
      url_foto_de_perfil: null // Añadido con valor null
    };
    const mockResponse = {
      cookie: jest.fn(),
    } as any;

    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue({
      identificacion: 12345678,
      tipoIdentificacion: 'CC',
      nombre_completo: 'John Doe',
      correo_electronico: mockRegisterDto.correo_electronico,
      contrasena: 'hashedPassword123',
      rol: 'P',
      pais: 'Colombia',
      ciudad: 'Cali',
      fecha_nacimiento: new Date('1990-01-01'),
      url_foto_de_perfil: null // Añadido con valor null
    });

    await expect(
      authService.register(mockRegisterDto, mockResponse),
    ).rejects.toThrow(UnauthorizedException);

    expect(userRepository.findByEmail).toHaveBeenCalledWith(
      mockRegisterDto.correo_electronico,
    );
    expect(userRepository.create).not.toHaveBeenCalled();
    expect(mockResponse.cookie).not.toHaveBeenCalled();
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const mockLoginDto = {
        correo_electronico: 'johndoe@example.com',
        contrasena: 'password123',
      };

      const mockUser = {
        identificacion: 12345678,
        tipoIdentificacion: 'CC',
        nombre_completo: 'John Doe',
        correo_electronico: 'johndoe@example.com',
        contrasena: 'hashedPassword123',
        rol: 'P',
        pais: 'Colombia',
        ciudad: 'Bogotá',
        fecha_nacimiento: new Date('1990-01-01'),
        url_foto_de_perfil: null // Añadido con valor null
      };

      const mockResponse = {
        cookie: jest.fn(),
      } as any;

      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await authService.login(mockLoginDto, mockResponse);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(mockLoginDto.correo_electronico);
      expect(bcrypt.compare).toHaveBeenCalledWith(mockLoginDto.contrasena, mockUser.contrasena);
      expect(mockResponse.cookie).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        user: {
          identificacion: mockUser.identificacion,
          tipoIdentificacion: mockUser.tipoIdentificacion,
          nombre_completo: mockUser.nombre_completo,
          correo_electronico: mockUser.correo_electronico,
          rol: mockUser.rol,
          pais: mockUser.pais,
          ciudad: mockUser.ciudad,
          fecha_nacimiento: mockUser.fecha_nacimiento,
          url_foto_de_perfil: null // Añadido en el resultado esperado
        },
      });
    });

    it('should throw UnauthorizedException when user not found', async () => {
      const mockLoginDto = {
        correo_electronico: 'nonexistent@example.com',
        contrasena: 'password123',
      };

      const mockResponse = {
        cookie: jest.fn(),
      } as any;

      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);

      await expect(
        authService.login(mockLoginDto, mockResponse)
      ).rejects.toThrow(UnauthorizedException);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(mockLoginDto.correo_electronico);
      expect(mockResponse.cookie).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      const mockLoginDto = {
        correo_electronico: 'johndoe@example.com',
        contrasena: 'wrongpassword',
      };

      const mockUser = {
        identificacion: 12345678,
        tipoIdentificacion: 'CC',
        nombre_completo: 'John Doe',
        correo_electronico: 'johndoe@example.com',
        contrasena: 'hashedPassword123',
        rol: 'P',
        pais: 'Colombia',
        ciudad: 'Bogotá',
        fecha_nacimiento: new Date('1990-01-01'),
        url_foto_de_perfil: null // Añadido con valor null
      };

      const mockResponse = {
        cookie: jest.fn(),
      } as any;

      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(
        authService.login(mockLoginDto, mockResponse)
      ).rejects.toThrow(UnauthorizedException);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(mockLoginDto.correo_electronico);
      expect(bcrypt.compare).toHaveBeenCalledWith(mockLoginDto.contrasena, mockUser.contrasena);
      expect(mockResponse.cookie).not.toHaveBeenCalled();
    });
  });
});