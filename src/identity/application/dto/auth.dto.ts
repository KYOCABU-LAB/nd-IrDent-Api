import { Role, User, UserRole } from 'generated/prisma';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

/**
 * clase para representar los datos de inicio de sesión
 * @export
 * @class LoginDto
 * @property {string} email - correo electrónico del usuario
 * @property {string} password - contraseña
 */
export class LoginDto {
  @IsEmail({}, { message: 'El formato del email no es válido' })
  @IsNotEmpty({ message: 'El email es requerido' })
  email: string;

  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
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
 * @property {object} user - información del usuario
 */
export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: number;
    email: string;
    name: string;
    roles: string[];
  };
}

/**
 * interface para representar el payload del JWT
 * @export
 * @interface JwtPayload
 * @property {string} email - correo electrónico del usuario
 * @property {number} sub - id del usuario
 * @property {string[]} roles - roles del usuario
 * @property {string} ip - dirección IP del usuario
 */
export interface JwtPayload {
  email: string;
  sub: number;
  roles: string[];
  ip?: string;
}
