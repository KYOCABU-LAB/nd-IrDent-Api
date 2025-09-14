import { Injectable } from '@nestjs/common';
import { RoleRepository } from '../../domain/repositories/role-repository.interface';
import { Role } from 'generated/prisma';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  /**
   * Obtiene un rol por su nombre
   * @param name  nombre del rol
   * @returns  el rol encontrado
   */
  async getRoleByName(name: string): Promise<Role | null> {
    return this.roleRepository.findByName(name);
  }

  /**
   * Crea un nuevo rol en la base de datos
   * @param name  nombre del rol
   * @param description  descripción del rol
   * @returns  el rol creado
   */
  async createRole(name: string, description: string): Promise<Role> {
    return this.roleRepository.create({
      nombre: name,
      descripcion: description,
    });
  }
  /**
   * Inicializa los roles en la base de datos
   */
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
