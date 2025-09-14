import { Injectable } from '@nestjs/common';
import { RoleRepository } from '../../domain/repositories/role-repository.interface';
import { Role } from 'generated/prisma';
import { PrismaClient } from 'generated/prisma';

@Injectable()
export class PrismaRoleRepository extends RoleRepository {
  constructor(private prisma: PrismaClient) {
    super();
  }

  async findByName(name: string): Promise<Role | null> {
    return this.prisma.role.findUnique({
      where: { nombre: name },
    });
  }

  async create(
    role: Omit<Role, 'id' | 'fecha_creacion' | 'fecha_actualizacion'>,
  ): Promise<Role> {
    return this.prisma.role.create({
      data: role,
    });
  }
}
