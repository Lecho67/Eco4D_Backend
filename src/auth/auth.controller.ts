import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ApiOperation,ApiResponse, ApiBody} from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registro de un nuevo usuario' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'El usuario ha sido registrado exitosamente.',
    example: {
      user: {
        cedula: 12345678,
        nombre_completo: 'John Doe',
        correo_electronico: 'johndoe@example.com',
        rol: 'P',
      },
      token: 'jwt_token_example',
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'El usuario ya existe.',
  })
  @ApiBody({ type: RegisterDto })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)

  @ApiOperation({ summary: 'Inicio de sesión de usuario' }) // Breve descripción del propósito del endpoint
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Inicio de sesión exitoso. Devuelve el usuario y el token.',
    example: {
      user: {
        cedula: '12345678',
        nombre_completo: 'John Doe',
        correo_electronico: 'johndoe@example.com',
        rol: 'P'
      },
      token: 'jwt_token_example',
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Credenciales inválidas.',
  })
  @ApiBody({ 
    type: LoginDto,
    description: 'Cuerpo de la solicitud para el inicio de sesión',
  })

  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }


}
