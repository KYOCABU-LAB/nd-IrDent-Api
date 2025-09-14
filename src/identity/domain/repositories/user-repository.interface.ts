import { Role, User, UserRole } from 'generated/prisma';

export type FullUser = User & {
  UserRole: (UserRole & { role: Role })[];
};

export abstract class UserRepository {
  abstract findByUsername(username: string): Promise<FullUser | null>;
}
