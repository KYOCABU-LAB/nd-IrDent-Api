import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * decorador para roles de un usuario
 * @param roles  lista de arreglos de roles
 * @returns  metadata con la lista de roles
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
