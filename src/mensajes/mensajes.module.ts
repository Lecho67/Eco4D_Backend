import { Module } from '@nestjs/common';
import { MensajesController } from './mensajes.controller';

@Module({
  controllers: [MensajesController]
})
export class MensajesModule {}
