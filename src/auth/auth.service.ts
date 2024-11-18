// auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwtPayload';
import { UserRepository } from '../usuarios/respositorios/UsersRepository';
import { Usuario } from '../usuarios/interfaces/Usuario';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private refreshTokenRepository: RefreshTokenRepository
  ) {}

  async register(registerDto: RegisterDto, response: Response) {
    const { contrasena, ...rest } = registerDto;
    
    const userExists = await this.userRepository.findByEmail(rest.correo_electronico);
  
    if (userExists) {
      throw new UnauthorizedException('El usuario ya existe');
    }
  
    const hashedPassword = await bcrypt.hash(contrasena, 10);
  
    const user = await this.userRepository.create({
      ...rest,
      contrasena: hashedPassword
    });
  
    // Generar access token
    const accessToken = await this.generateToken(user);
    
    // Generar refresh token
    const refreshToken = await this.generateRefreshToken(user.identificacion);
  
    // Establecer cookies
    this.setAuthCookie(accessToken, response);
    this.setRefreshCookie(refreshToken, response);
  
    return {
      user: {
        identificacion: user.identificacion,
        tipoIdentificacion: user.tipoIdentificacion,
        nombre_completo: user.nombre_completo,
        correo_electronico: user.correo_electronico,
        rol: user.rol,
        pais: user.pais,
        ciudad: user.ciudad,
        fecha_nacimiento: user.fecha_nacimiento
      }
    };
  }

  async login(loginDto: LoginDto, response: Response) {
    const { correo_electronico, contrasena } = loginDto;
  
    const user = await this.userRepository.findByEmail(correo_electronico);
  
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
  
    const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);
  
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
  
    // Generar access token
    const accessToken = await this.generateToken(user);
    
    // Generar refresh token
    const refreshToken = await this.generateRefreshToken(user.identificacion);
  
    // Establecer cookies
    this.setAuthCookie(accessToken, response);
    this.setRefreshCookie(refreshToken, response);
  
    return {
      user: {
        identificacion: user.identificacion,
        tipoIdentificacion: user.tipoIdentificacion,
        nombre_completo: user.nombre_completo,
        correo_electronico: user.correo_electronico,
        rol: user.rol,
        pais: user.pais,
        ciudad: user.ciudad,
        fecha_nacimiento: user.fecha_nacimiento
      }
    };
  }

  async generateRefreshToken(userId: number): Promise<string> {
    const expiresIn = 7 * 24 * 60 * 60; // 7 días en segundos
    const fechaExpiracion = new Date();
    fechaExpiracion.setSeconds(fechaExpiracion.getSeconds() + expiresIn);

    // Guardar en base de datos
    await this.refreshTokenRepository.create(userId, fechaExpiracion);

    // Generar token
    const refreshToken = this.jwtService.sign(
      { sub: userId },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: `${expiresIn}s`,
      }
    );

    return refreshToken;
  }

  async refreshAccessToken(refreshToken: string, response: Response) {
    try {
      // Verificar el refresh token
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET
      });

      // Buscar el refresh token en la base de datos
      const storedToken = await this.refreshTokenRepository.findByUserId(payload.sub);
      
      if (!storedToken) {
        throw new UnauthorizedException('Refresh token no encontrado');
      }

      // Verificar si el token ha expirado
      if (new Date() > storedToken.fechaExpiracion) {
        await this.refreshTokenRepository.delete(payload.sub);
        throw new UnauthorizedException('Refresh token expirado');
      }

      // Buscar el usuario
      const user = await this.userRepository.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      // Generar nuevo access token
      const accessToken = await this.generateToken(user);
      
      // Generar nuevo refresh token
      const newRefreshToken = await this.generateRefreshToken(user.identificacion);

      // Establecer las cookies
      this.setAuthCookie(accessToken, response);
      this.setRefreshCookie(newRefreshToken, response);

      return {
        user: {
          identificacion: user.identificacion,
          correo_electronico: user.correo_electronico,
          rol: user.rol
        }
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
  async logout(response: Response) {
    response.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      path: '/'
    });
    
    response.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      path: '/auth/refresh'
    });
    
    return { message: 'Logout exitoso' };
  }
  private async generateToken(user: Usuario) {
    const payload: JwtPayload = {
      sub: user.identificacion,
      email: user.correo_electronico,
      rol: user.rol,
    };

    return this.jwtService.sign(payload);
  }

  private setAuthCookie(token: string, response: Response) {
    response.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000, // 1 día
      path: '/'
    });
  }

  private setRefreshCookie(token: string, response: Response) {
    response.cookie('refreshToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
      path: '/auth/refresh'
    });
  }
}