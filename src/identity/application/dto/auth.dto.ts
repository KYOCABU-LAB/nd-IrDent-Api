import { Role, User, UserRole } from 'generated/prisma';

/**
 * interface para representar los datos de inicio de sesión
 * @export
 * @interface LoginDto
 * @property {string} email - correo electrónico del usuario
 * @property {string} password - contraseña
 */
export interface LoginDto {
  email: string;
  password: string;
}

/**
 * interface para representar un usuario validado
 */
export type ValidatedUser = Omit<User, 'password_hash'> & {
  UserRole: (UserRole & { role: Role })[];
};

/**
 * interface para representar la respuesta de inicio de sesión
 * @export
 * @interface LoginResponse
 * @property {string} access_token - token de acceso
 * @property {string} refresh_token - token de refresco
 */
export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

/**
 * interface para representar el payload del JWT
 * @export
 * @interface JwtPayload
 * @property {string} username - nombre de usuario
 * @property {number} sub - id del usuario
 * @property {string[]} roles - roles del usuario
 * @property {string} ip - dirección IP del usuario
 */
export interface JwtPayload {
  username: string;
  sub: number;
  roles: string[];
  ip?: string;
}
