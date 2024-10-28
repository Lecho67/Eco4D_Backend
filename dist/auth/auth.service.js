"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const UsersRepository_1 = require("../usuarios/respositorios/UsersRepository");
let AuthService = class AuthService {
    constructor(userRepository, jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        const { contrasena, ...rest } = registerDto;
        const userExists = await this.userRepository.findByEmail(rest.correo_electronico);
        if (userExists) {
            throw new common_1.UnauthorizedException('El usuario ya existe');
        }
        const hashedPassword = await bcrypt.hash(contrasena, 10);
        const user = await this.userRepository.create({
            ...rest,
            contrasena: hashedPassword,
        });
        const token = await this.generateToken(user);
        return {
            user: {
                cedula: user.cedula,
                nombre_completo: user.nombre_completo,
                correo_electronico: user.correo_electronico,
                rol: user.rol,
            },
            token,
        };
    }
    async login(loginDto) {
        const { correo_electronico, contrasena } = loginDto;
        const user = await this.userRepository.findByEmail(correo_electronico);
        if (!user) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        const token = await this.generateToken(user);
        return {
            user: {
                cedula: user.cedula,
                nombre_completo: user.nombre_completo,
                correo_electronico: user.correo_electronico,
                rol: user.rol,
            },
            token,
        };
    }
    async generateToken(user) {
        const payload = {
            sub: user.cedula,
            email: user.correo_electronico,
            rol: user.rol,
        };
        return this.jwtService.sign(payload);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [UsersRepository_1.UserRepository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map