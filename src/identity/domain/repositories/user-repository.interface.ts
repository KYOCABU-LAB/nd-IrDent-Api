import { Role, User, UserRole } from 'generated/prisma';

export type FullUser = User & {
  UserRole: (UserRole & { role: Role })[];
};

export type CreateUserData = {
  username: string;
  password_hash: string;
  email: string;
  nombre: string;
  apellido: string;
  telefono?: string | null;
  estado?: 'ACTIVO' | 'INACTIVO';
};

export abstract class UserRepository {
  abstract findByUsername(username: string): Promise<FullUser | null>;
  abstract create(userData: CreateUserData): Promise<User>;
  abstract assignRole(userId: number, roleId: number): Promise<UserRole>;
}
