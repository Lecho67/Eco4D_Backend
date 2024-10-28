import { IsEmail, IsIn, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNumber()
  @IsNotEmpty()
  cedula: number;

  @IsString()
  @IsNotEmpty()
  nombre_completo: string;

  @IsEmail()
  @IsNotEmpty()
  correo_electronico: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  contrasena: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1)
  @IsIn(['P','M','A'], { message: 'the rol has to be P, M or A in uppercase' })
  rol: string;
}