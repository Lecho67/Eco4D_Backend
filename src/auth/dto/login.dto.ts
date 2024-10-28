import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  correo_electronico: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  contrasena: string;
}