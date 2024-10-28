import { IsEmail, IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

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
  rol: string;
}