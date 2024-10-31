import { IsNotEmpty, IsString, IsEnum, IsOptional, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class SolicitudDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  titulo: string;

  @ApiProperty()
  fechaReporte: Date;

  @ApiPropertyOptional()
  @IsOptional()
  fechaSolucion?: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsIn(['fallas tecnicas', 'inconsistencia de datos','configuraciones', 'otros'])
  tipo: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @ApiProperty()
  solicitanteId: number;

  @ApiPropertyOptional()
  @IsOptional()
  encargadoId?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEnum(['A', 'R'])
  estado: string;
}
