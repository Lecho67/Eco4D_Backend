import { Module } from '@nestjs/common';
import { SoporteController } from './soporte.controller';

@Module({
  controllers: [SoporteController]
})
export class SoporteModule {}
