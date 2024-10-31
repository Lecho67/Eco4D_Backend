import { Usuario } from "./usuario";

export interface IUserRepository {
    findById(id: number): Promise<Usuario>;
    findByEmail(email: string): Promise<Usuario>;
    create(user: Usuario): Promise<Usuario>;
    update(id: number, user: Partial<Usuario>): Promise<Usuario>;
    delete(id: number): Promise<void>;
  }