import { IsEmail, IsIn, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength, IsDate,IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
export class RegisterDto {
  @ApiProperty({
    example: 12345678,
    description: 'Número de cédula del usuario',
  })
  @IsNumber()
  @IsNotEmpty()
  @MaxLength(10)
  identificacion: number;

  @ApiProperty({
    example: 'CC',
    description: 'Tipo de identificación del usuario: CC, TI, CE',
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['CC', 'TI', 'CE'])
  tipoIdentificacion: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Nombre completo del usuario',
  })
  @IsString()
  @IsNotEmpty()
  nombre_completo: string;

  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'Correo electrónico del usuario',
  })
  @IsEmail()
  @IsNotEmpty()
  correo_electronico: string;

  @ApiProperty({
    example: 'password123',
    description: 'Contraseña del usuario, debe tener al menos 6 caracteres',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  contrasena: string;

  @ApiProperty({
    example: 'P',
    description: "Rol del usuario: 'P' para paciente, 'M' para médico, 'A' para administrador",
    maxLength: 1,
  })
  @IsString()
  @MaxLength(1)
  @IsOptional()

  @IsIn(['P', 'M', 'A'], { message: 'El rol debe ser P, M o A en mayúsculas' })
  rol?: string;

  @ApiProperty({
    example: 'Colombia',
    description: 'País de residencia del usuario',
  })
  @IsString()
  @IsNotEmpty()
  pais: string;

  @ApiProperty({
    example: 'Bogotá',
    description: 'Ciudad de residencia del usuario',
  })
  @IsString()
  @IsNotEmpty()
  ciudad: string;

  @ApiProperty({
    example: '1990-01-01',
    description: 'Fecha de nacimiento del usuario',
  })
  @IsDate()
  @IsNotEmpty()
  @Type(()=>Date)
  fecha_nacimiento: Date;
}
