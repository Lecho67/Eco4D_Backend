import { Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwtPayload';
import { UserRepository } from 'src/usuarios/respositorios/UsersRepository';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private userRepository;
    constructor(userRepository: UserRepository);
    validate(payload: JwtPayload): Promise<import("../../usuarios/interfaces/Usuario").Usuario>;
}
export {};
