import { Injectable } from '@nestjs/common';
import { RoleRepository } from '../../domain/repositories/role-repository.interface';
import { Role } from 'generated/prisma';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async getRoleByName(name: string): Promise<Role | null> {
    return this.roleRepository.findByName(name);
  }

  async createRole(name: string, description: string): Promise<Role> {
    return this.roleRepository.create({
      nombre: name,
      descripcion: description,
    });
  }

  async initializeRoles(): Promise<void> {
    const roles = [
      { name: 'admin', description: 'Administrador del sistema' },
      { name: 'doctor', description: 'Doctor en la clínica' },
    ];

    for (const { name, description } of roles) {
      const existingRole = await this.getRoleByName(name);
      if (!existingRole) {
        await this.createRole(name, description);
      }
    }
  }
}
