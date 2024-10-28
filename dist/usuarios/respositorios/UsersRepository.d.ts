import { PrismaService } from 'src/prisma.service';
import { Usuario } from '../interfaces/Usuario';
import { IUserRepository } from '../interfaces/UserRepository';
export declare class UserRepository implements IUserRepository {
    private prisma;
    constructor(prisma: PrismaService);
    findById(id: number): Promise<Usuario>;
    findByEmail(email: string): Promise<Usuario>;
    create(user: Partial<Usuario>): Promise<Usuario>;
    update(id: number, user: Partial<Usuario>): Promise<Usuario>;
    delete(id: number): Promise<void>;
}
