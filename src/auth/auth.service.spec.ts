// import { Test, TestingModule } from '@nestjs/testing';
// import { AuthService } from './auth.service';
// import { UserRepository } from '../usuarios/respositorios/UsersRepository';
// import { JwtService } from '@nestjs/jwt';
// import { RefreshTokenRepository } from './repositories/refresh-token.repository';
// import { UnauthorizedException } from '@nestjs/common';
// import { RegisterDto } from './dto/register.dto';
// import * as bcrypt from 'bcrypt';
// import { Response } from 'express';

// jest.mock('bcrypt');

// describe('AuthService', () => {
//   let authService: AuthService;
//   let userRepository: UserRepository;
//   let jwtService: JwtService;
//   let refreshTokenRepository: RefreshTokenRepository;
//   let response: Partial<Response>;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         AuthService,
//         {
//           provide: UserRepository,
//           useValue: {
//             findByEmail: jest.fn(),
//             create: jest.fn(),
//             findById: jest.fn(),
//           },
//         },
//         {
//           provide: JwtService,
//           useValue: {
//             sign: jest.fn().mockReturnValue('fakeToken'),
//             verifyAsync: jest.fn(),
//           },
//         },
//         {
//           provide: RefreshTokenRepository,
//           useValue: {
//             create: jest.fn(),
//             findByUserId: jest.fn(),
//             delete: jest.fn(),
//           },
//         },
//       ],
//     }).compile();

//     authService = module.get<AuthService>(AuthService);
//     userRepository = module.get<UserRepository>(UserRepository);
//     jwtService = module.get<JwtService>(JwtService);
//     refreshTokenRepository = module.get<RefreshTokenRepository>(RefreshTokenRepository);

//     response = {
//       cookie: jest.fn(),
//       clearCookie: jest.fn(),
//     };

//     jest.spyOn(bcrypt, 'hash').mockImplementation(async () => 'hashedPassword');
//     jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);
    
//   });

//   it('should register a new user', async () => {
//     const registerDto: RegisterDto = {
//       identificacion: 12345678,
//       tipoIdentificacion: 'CC',
//       nombre_completo: 'John Doe',
//       correo_electronico: 'johndoe@example.com',
//       contrasena: 'password123',
//       rol: 'P',
//       pais: 'Colombia',
//       ciudad: 'Bogotá',
//       fecha_nacimiento: new Date('1990-01-01'),
//     };

//     userRepository.findByEmail = jest.fn().mockResolvedValue(null);
//     userRepository.create = jest.fn().mockResolvedValue({
//       ...registerDto,
//       identificacion: registerDto.identificacion,
//     });

//     const result = await authService.register(registerDto, response as Response);

//     expect(result.user).toMatchObject({
//       identificacion: registerDto.identificacion,
//       tipoIdentificacion: registerDto.tipoIdentificacion,
//       nombre_completo: registerDto.nombre_completo,
//       correo_electronico: registerDto.correo_electronico,
//       rol: registerDto.rol,
//       pais: registerDto.pais,
//       ciudad: registerDto.ciudad,
//       fecha_nacimiento: registerDto.fecha_nacimiento,
//     });
//     expect(response.cookie).toHaveBeenCalledWith('token', 'fakeToken', expect.any(Object));
//     expect(response.cookie).toHaveBeenCalledWith('refreshToken', 'fakeToken', expect.any(Object));
//   });

//   it('should throw UnauthorizedException if user already exists', async () => {
//     const registerDto: RegisterDto = {
//       identificacion: 12345678,
//       tipoIdentificacion: 'CC',
//       nombre_completo: 'John Doe',
//       correo_electronico: 'johndoe@example.com',
//       contrasena: 'password123',
//       rol: 'P',
//       pais: 'Colombia',
//       ciudad: 'Bogotá',
//       fecha_nacimiento: new Date('1990-01-01'),
//     };

//     userRepository.findByEmail = jest.fn().mockResolvedValue(registerDto);

//     await expect(authService.register(registerDto, response as Response)).rejects.toThrow(UnauthorizedException);
//   });
// });
