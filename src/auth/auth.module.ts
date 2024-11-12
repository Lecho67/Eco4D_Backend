import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/JWTStrategy';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { AuthGuard } from './auth.guard';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [
    UsuariosModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy,RefreshTokenRepository,PrismaService],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}