import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSolicitudDto {
  @ApiProperty({ example: 'Error en el sistema', description: 'Título de la solicitud' })
  @IsNotEmpty()
  @IsString()
  titulo: string;

  @ApiProperty({
    example: 'fallas tecnicas',
    description: 'Tipo de solicitud',
    enum: ['fallas tecnicas', 'inconsistencia de datos', 'configuraciones', 'otros'],
  })
  @IsNotEmpty()
  @IsString()
  @IsIn(['fallas tecnicas', 'inconsistencia de datos', 'configuraciones', 'otros'])
  tipo: string;

  @ApiProperty({
    example: 'La aplicación se cierra al intentar guardar un documento',
    description: 'Descripción detallada del problema o solicitud',
  })
  @IsNotEmpty()
  @IsString()
  descripcion: string;
}