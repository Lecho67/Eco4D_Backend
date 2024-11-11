import { IsEmail, IsNotEmpty, IsNumber, IsString, MinLength, IsIn, IsDate, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
export class CreateUserDto {
  @ApiProperty({
    description: 'Número de identificación del usuario',
    example: 1234567890
  })
  @IsNotEmpty()
  @IsNumber()
  identificacion: number;

  @ApiProperty({
    description: 'Tipo de identificación del usuario CC, TI, CE',
    example: 'CC'
  })
  @IsNotEmpty()
  @IsString()
  @IsIn(['CC', 'TI', 'CE'])
  tipoIdentificacion: string;

  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez'
  })
  @IsNotEmpty()
  @IsString()
  nombre_completo: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'juan.perez@email.com'
  })
  @IsNotEmpty()
  @IsEmail()
  correo_electronico: string;

  @ApiProperty({
    description: 'Contraseña del usuario (mínimo 6 caracteres)',
    example: '123456'
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  contrasena: string;

  @ApiProperty({
    description: 'Rol del usuario (P=Paciente, M=Médico, A=Administrador)',
    example: 'P'
  })

  @IsString()
  @IsOptional()
  @IsIn(['P', 'M', 'A'])
  rol?: string;

  @ApiProperty({
    description: 'País de residencia del usuario',
    example: 'Colombia'
  })
  @IsNotEmpty()
  @IsString()
  pais: string;

  @ApiProperty({
    description: 'Ciudad de residencia del usuario',
    example: 'Bogotá'
  })
  @IsNotEmpty()
  @IsString()
  ciudad: string;

  @ApiProperty({
    description: 'Fecha de cumpleaños del usuario',
    example: '1990-01-01'
  })
  @IsNotEmpty()
  @IsDate()
  @Type(()=>Date)
  fecha_nacimiento: Date;
}