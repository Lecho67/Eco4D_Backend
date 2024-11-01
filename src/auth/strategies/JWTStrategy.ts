import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwtPayload';
import { UserRepository } from 'src/usuarios/respositorios/UsersRepository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    const { sub,rol } = payload;

    const user = await this.userRepository.findById(sub);

    if (!user) {
      throw new UnauthorizedException('Token no válido');
    }

    return {
            nombre: user.nombre_completo,
            cedula: user.identificacion,
            correo_electronico: user.correo_electronico,
            rol
          };
  }
}