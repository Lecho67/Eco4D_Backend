import { IsEmail, IsIn, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 12345678,
    description: 'Número de cédula del usuario',
  })
  @IsNumber()
  @IsNotEmpty()
  cedula: number;

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
    description: "Rol del usuario: 'P' para paciente, 'M' para medico, o 'A' para administrador",
    maxLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1)
  @IsIn(['P', 'M', 'A'], { message: 'the rol has to be P, M or A in uppercase' })
  rol: string;
}