import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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

  async register(registerDto: RegisterDto) {
    const { contrasena, ...rest } = registerDto;
    
    // Verificar si el usuario ya existe
    const userExists = await this.userRepository.findByEmail(rest.correo_electronico);

    if (userExists) {
      throw new UnauthorizedException('El usuario ya existe');
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Crear usuario
    const user = await this.userRepository.create({
      ...rest,
      contrasena: hashedPassword
    });

    // Generar token
    const token = await this.generateToken(user);

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
      },
      token,
    };
  }

  async login(loginDto: LoginDto) {
    const { correo_electronico, contrasena } = loginDto;

    // Buscar usuario
    const user = await this.userRepository.findByEmail(correo_electronico);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar token
    const token = await this.generateToken(user);

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
        
      },
      token,
    };
  }

  private async generateToken(user: Usuario) {
    const payload: JwtPayload = {
      sub: user.identificacion,
      email: user.correo_electronico,
      rol: user.rol,
    };

    return this.jwtService.sign(payload);
  }
}
