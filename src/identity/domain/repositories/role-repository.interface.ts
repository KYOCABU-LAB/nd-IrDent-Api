import { Role } from 'generated/prisma';

export abstract class RoleRepository {
  abstract findByName(name: string): Promise<Role | null>;
  abstract create(
    role: Omit<Role, 'id' | 'fecha_creacion' | 'fecha_actualizacion'>,
  ): Promise<Role>;
}
