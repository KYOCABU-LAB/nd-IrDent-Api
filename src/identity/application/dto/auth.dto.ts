import { Role, User, UserRole } from 'generated/prisma';

export interface LoginDto {
  username: string;
  password: string;
}

export type ValidatedUser = Omit<User, 'password_hash'> & {
  UserRole: (UserRole & { role: Role })[];
};

export interface LoginResponse {
  access_token: string;
}

export interface JwtPayload {
  username: string;
  sub: number;
  roles: string[];
}
