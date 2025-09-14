import { Injectable } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import { UserRepository } from '../../domain/repositories/user-repository.interface';

@Injectable()
export class PrismaUserRepository extends UserRepository {
  constructor(private readonly prisma: PrismaClient) {
    super();
  }

  async findByUsername(username: string): Promise<any | null> {
    return this.prisma.user.findUnique({
      where: { username },
      include: { UserRole: { include: { role: true } } },
    });
  }
}
