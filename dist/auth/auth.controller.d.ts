import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
}
