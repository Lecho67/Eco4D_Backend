// auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwtPayload';
import { UserRepository } from 'src/usuarios/respositorios/UsersRepository';
import { Usuario } from 'src/usuarios/interfaces/Usuario';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
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

    // Generar token y establecer cookie
    await this.setAuthCookie(user, response);

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

    // Generar token y establecer cookie
    await this.setAuthCookie(user, response);

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

  async logout(response: Response) {
    response.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
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

  private async setAuthCookie(user: Usuario, response: Response) {
    const token = await this.generateToken(user);
    
    // Establecer cookie HTTP-only
    response.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true en producción
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 día
      path: '/'
    });
  }
}