import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsInt, IsString, MinLength } from 'class-validator';

// DTO Schema
export class CreateDiagnosticoDto {
  @ApiProperty({
    description: 'ID del paciente',
    example: 123456789,
    required: true
  })
  @IsNotEmpty({ message: 'El ID del paciente es requerido' })
  @IsInt({ message: 'El ID del paciente debe ser un número entero' })
  @Type(() => Number)
  pacienteId: number;

  @ApiProperty({
    description: 'Descripción del diagnóstico',
    example: 'Diagnóstico detallado del paciente...',
    minLength: 10,
    required: true
  })
  @IsNotEmpty({ message: 'La descripción es requerida' })
  @IsString({ message: 'La descripción debe ser un texto' })
  @MinLength(10, { message: 'La descripción debe tener al menos 10 caracteres' })
  descripcion: string;

  @ApiProperty({
    description: 'Edad gestacional del paciente',
    example: '28 semanas',
    required: true
  })
  @IsNotEmpty({ message: 'La edad gestacional es requerida' })
  @IsString({ message: 'La edad gestacional debe ser un texto' })
  edadGestacional: string;

  shareLink?: string;

  @ApiProperty({
    description: 'Calificación del diagnóstico',
    example: 5,
    required: false
  })
  @Type(() => Number)
  calificacion?: number;
}