import { Injectable } from '@nestjs/common';
import { PrismaClient, User, UserRole } from 'generated/prisma';
import { UserRepository, CreateUserData, FullUser } from '../../domain/repositories/user-repository.interface';

@Injectable()
export class PrismaUserRepository extends UserRepository {
  constructor(private readonly prisma: PrismaClient) {
    super();
  }

  async findByUsername(username: string): Promise<FullUser | null> {
    return this.prisma.user.findUnique({
      where: { username },
      include: { UserRole: { include: { role: true } } },
    });
  }

  async create(userData: CreateUserData): Promise<User> {
    return this.prisma.user.create({
      data: userData,
    });
  }

  async assignRole(userId: number, roleId: number): Promise<UserRole> {
    return this.prisma.userRole.create({
      data: {
        userId,
        roleId,
      },
    });
  }
}
