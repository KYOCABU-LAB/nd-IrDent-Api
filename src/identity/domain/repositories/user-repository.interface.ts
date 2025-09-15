import { RefreshToken, Role, User, UserRole } from 'generated/prisma';

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
  abstract findByEmail(email: string): Promise<FullUser | null>;
  abstract create(userData: CreateUserData): Promise<User>;
  abstract assignRole(userId: number, roleId: number): Promise<UserRole>;
  abstract createRefreshToken(data: { token: string; userId: number; expiresAt: Date }): Promise<RefreshToken>;
  abstract findRefreshToken(token: string): Promise<RefreshToken | null>;
  abstract deleteRefreshToken(token: string): Promise<void>;
  abstract findById(id: number): Promise<FullUser | null>;
}
