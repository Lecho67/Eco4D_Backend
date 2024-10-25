import { Module } from '@nestjs/common';
import { DiagnosticosController } from './diagnosticos.controller';

@Module({
  controllers: [DiagnosticosController]
})
export class DiagnosticosModule {}
