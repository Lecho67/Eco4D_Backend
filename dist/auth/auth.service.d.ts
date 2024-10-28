import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserRepository } from 'src/usuarios/respositorios/UsersRepository';
export declare class AuthService {
    private userRepository;
    private jwtService;
    constructor(userRepository: UserRepository, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        user: {
            cedula: number;
            nombre_completo: string;
            correo_electronico: string;
            rol: string;
        };
        token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: {
            cedula: number;
            nombre_completo: string;
            correo_electronico: string;
            rol: string;
        };
        token: string;
    }>;
    private generateToken;
}
