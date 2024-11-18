import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class RefreshTokenRepository {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, fechaExpiracion: Date) {
    return this.prisma.refreshToken.upsert({
      where: { userId },
      update: { fechaExpiracion },
      create: { userId, fechaExpiracion }
    });
  }

  async findByUserId(userId: number) {
    return this.prisma.refreshToken.findUnique({
      where: { userId }
    });
  }

  async delete(userId: number) {
    return this.prisma.refreshToken.delete({
      where: { userId }
    });
  }
}
