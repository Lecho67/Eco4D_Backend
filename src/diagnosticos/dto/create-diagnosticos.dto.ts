// dto/create-diagnostico.dto.ts
import { Type } from 'class-transformer';
import { IsNotEmpty, IsInt, IsString, MinLength } from 'class-validator';

export class CreateDiagnosticoDto {
  @IsNotEmpty({ message: 'El ID del paciente es requerido' })
  @IsInt({ message: 'El ID del paciente debe ser un número entero' })
  @Type(() => Number)
  pacienteId: number;

  @IsNotEmpty({ message: 'La descripción es requerida' })
  @IsString({ message: 'La descripción debe ser un texto' })
  @MinLength(10, { message: 'La descripción debe tener al menos 10 caracteres' })
  descripcion: string;

  @IsNotEmpty({ message: 'La edad gestacional es requerida' })
  @IsString({ message: 'La edad gestacional debe ser un texto' })

  edadGestacional: string;

  // Removemos enlaceFoto ya que ahora vendrá como archivo
  shareLink?: string;
  @Type(() => Number)
  calificacion?: number;
}