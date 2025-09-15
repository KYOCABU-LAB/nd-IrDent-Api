import { Injectable } from '@nestjs/common';
import { PrismaClient, User, UserRole, RefreshToken } from 'generated/prisma';
import { UserRepository, CreateUserData, FullUser } from '../../domain/repositories/user-repository.interface';

@Injectable()
export class PrismaUserRepository extends UserRepository {
  constructor(private readonly prisma: PrismaClient) {
    super();
  }

  async findByUsername(username: string): Promise<FullUser | null> {
    return this.prisma.user.findFirst({
      where: { username },
      include: { UserRole: { include: { role: true } } },
    });
  }

  async findByEmail(email: string): Promise<FullUser | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: { UserRole: { include: { role: true } } },
    });
  }

  async findById(id: number): Promise<FullUser | null> {
    return this.prisma.user.findUnique({
      where: { id },
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
  async createRefreshToken(data: { token: string; userId: number; expiresAt: Date }): Promise<RefreshToken> {
    return this.prisma.refreshToken.create({
      data,
    });
  }
  async findRefreshToken(token: string): Promise<RefreshToken | null> {
    return this.prisma.refreshToken.findUnique({
      where: { token },
    });
  }
  async deleteRefreshToken(token: string): Promise<void> {
    await this.prisma.refreshToken.delete({
      where: { token },
    });
  }
}
