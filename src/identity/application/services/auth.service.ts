import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../../domain/repositories/user-repository.interface';
import * as bcrypt from 'bcryptjs';
import {
  LoginDto,
  ValidatedUser,
  JwtPayload,
  LoginResponse,
} from '../dto/auth.dto';
import {
  UserNotFoundException,
  InvalidPasswordException,
} from '../exceptions/auth.exceptions';
import { v4 as uuidv4 } from 'uuid';
import { UserValidator } from '../../domain/validators/user.validator';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  /**
   *  Validar un usuario por su correo electrónico y contraseña
   * @param email correo electrónico del usuario
   * @param password contraseña
   * @returns un objeto de usuario si el correo electrónico y la contraseña son válidos
   * @throws UserNotFoundException si el usuario no existe
   * @throws InvalidPasswordException si la contraseña es incorrecta
   * @returns un objeto de usuario si el correo electrónico y la contraseña son válidos
   */
  async validateUser(email: string, password: string): Promise<ValidatedUser> {
    this.logger.debug(`Validando usuario con email: ${email}`);

    if (!UserValidator.validateEmail(email)) {
      this.logger.warn(`Formato de email inválido: ${email}`);
      throw new InvalidPasswordException('El formato del email no es válido');
    }

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      this.logger.warn(`Usuario no encontrado con email: ${email}`);
      throw new UserNotFoundException(
        'El email no existe, por favor registrese',
      );
    }

    if (!(await bcrypt.compare(password, user.password_hash))) {
      this.logger.warn(`Contraseña incorrecta para email: ${email}`);
      throw new InvalidPasswordException('La contraseña es incorrecta');
    }

    this.logger.debug(`Usuario validado exitosamente: ${email}`);
    const { password_hash, ...result } = user;
    return result;
  }

  /**
   *  Iniciar sesión con un correo electrónico y contraseña
   * @param loginDto objeto de inicio de sesión
   * @param ip dirección IP del cliente
   * @returns un objeto con access_token y refresh_token
   * @throws UserNotFoundException si el usuario no existe
   * @throws InvalidPasswordException si la contraseña es incorrecta
   */
  async login(loginDto: LoginDto, ip: string): Promise<LoginResponse> {
    this.logger.log(
      `Iniciando proceso de login para email: ${loginDto.email} desde IP: ${ip}`,
    );

    const user = await this.validateUser(loginDto.email, loginDto.password);

    const payload: JwtPayload = {
      email: user.email,
      sub: user.id,
      roles: user.UserRole.map((ur) => ur.role.nombre),
      ip,
    };

    const access_token = this.jwtService.sign(payload);
    const refresh_token = uuidv4();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.userRepository.createRefreshToken({
      token: refresh_token,
      userId: user.id,
      expiresAt,
    });

    const roles = user.UserRole.map((ur) => ur.role.nombre);

    this.logger.log(
      `Login exitoso para usuario ID: ${user.id}, email: ${user.email}, roles: [${roles.join(', ')}]`,
    );

    return {
      access_token,
      refresh_token,
      user: {
        id: user.id,
        email: user.email,
        name: `${user.nombre} ${user.apellido}`,
        roles,
      },
    };
  }

  async refresh(refreshToken: string, ip: string): Promise<LoginResponse> {
    this.logger.log(`Iniciando proceso de refresh token desde IP: ${ip}`);

    const token = await this.userRepository.findRefreshToken(refreshToken);
    if (!token || token.expiresAt < new Date()) {
      this.logger.warn(`Token de refresh inválido o expirado desde IP: ${ip}`);
      throw new UnauthorizedException('Token de refresco inválido o expirado');
    }

    const user = await this.userRepository.findById(token.userId);
    if (!user) {
      this.logger.error(
        `Usuario no encontrado para refresh token, userId: ${token.userId}`,
      );
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // eliminar el token anterior
    await this.userRepository.deleteRefreshToken(refreshToken);
    this.logger.debug(`Token anterior eliminado para usuario ID: ${user.id}`);

    // se genera un nuevo token
    const payload: JwtPayload = {
      email: user.email,
      sub: user.id,
      roles: user.UserRole.map((ur) => ur.role.nombre),
      ip,
    };
    const access_token = this.jwtService.sign(payload);

    // se genera un nuevo refresh token
    const newRefreshToken = uuidv4();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await this.userRepository.createRefreshToken({
      token: newRefreshToken,
      userId: user.id,
      expiresAt,
    });

    this.logger.log(
      `Refresh token exitoso para usuario ID: ${user.id}, email: ${user.email}`,
    );

    return {
      access_token,
      refresh_token: newRefreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: `${user.nombre} ${user.apellido}`,
        roles: user.UserRole.map((ur) => ur.role.nombre),
      },
    };
  }
}
