import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from './roles.decorator';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    
    const role = this.reflector.getAllAndOverride(ROLES_KEY, [context.getHandler(), context.getClass()]);

    if (!role) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    
    if (role[0] !== request.user.rol) {
      throw new UnauthorizedException('No tienes permiso para acceder a este recurso');
    }

    return true;
  }
}
