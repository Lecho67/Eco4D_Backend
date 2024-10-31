import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'Correo electrónico del usuario para iniciar sesión',
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
}
