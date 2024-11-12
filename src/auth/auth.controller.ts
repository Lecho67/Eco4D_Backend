import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Res, UnauthorizedException, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Response,Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registro de un nuevo usuario' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'El usuario ha sido registrado exitosamente.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'El usuario ya existe.',
  })
  @ApiBody({ type: RegisterDto })
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) response: Response
  ) {
    return this.authService.register(registerDto, response);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Inicio de sesión de usuario' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Inicio de sesión exitoso.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Credenciales inválidas.',
  })
  @ApiBody({ 
    type: LoginDto,
    description: 'Cuerpo de la solicitud para el inicio de sesión',
  })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response
  ) {
    return this.authService.login(loginDto, response);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cierre de sesión de usuario' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cierre de sesión exitoso.',
  })
  async logout(@Res({ passthrough: true }) response: Response) {
    return this.authService.logout(response);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refrescar token de acceso' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Token refrescado exitosamente.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Refresh token inválido o expirado.',
  })
  async refreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response
  ) {
    const refreshToken = request.cookies?.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('No se proporcionó refresh token');
    }
    return this.authService.refreshAccessToken(refreshToken, response);
  }

}
