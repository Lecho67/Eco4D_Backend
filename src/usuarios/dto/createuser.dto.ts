import { IsEmail, IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsNumber()
  cedula: number;

  @IsNotEmpty()
  @IsString()
  nombre_completo: string;

  @IsNotEmpty()
  @IsEmail()
  correo_electronico: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  contrasena: string;

  @IsNotEmpty()
  @IsString()
  rol: string;
}
