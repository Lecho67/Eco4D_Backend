import { PrismaService } from 'src/prisma.service';
import { Usuario } from '../interfaces/Usuario';
import { IUserRepository } from '../interfaces/UserRepository';
import { CreateUserDto } from '../dto/createuser.dto';
export declare class UserRepository implements IUserRepository {
    private prisma;
    constructor(prisma: PrismaService);
    findById(id: number): Promise<Usuario>;
    findByEmail(email: string): Promise<Usuario>;
    create(user: CreateUserDto): Promise<Usuario>;
    update(id: number, user: Partial<CreateUserDto>): Promise<Usuario>;
    delete(id: number): Promise<void>;
}
