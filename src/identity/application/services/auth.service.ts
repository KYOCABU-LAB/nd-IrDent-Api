import { Injectable, UnauthorizedException } from '@nestjs/common';
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

@Injectable()
export class AuthService {
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
  async validateUser(
    email: string,
    password: string,
  ): Promise<ValidatedUser> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new UserNotFoundException();
    }
    if (!(await bcrypt.compare(password, user.password_hash))) {
      throw new InvalidPasswordException();
    }
    const { password_hash, ...result } = user;
    return result;
  }

  /**
   *  Iniciar sesión con un correo electrónico y contraseña
   * @param loginDto objeto de inicio de sesión
   * @returns un objeto de usuario si el correo electrónico y la contraseña son válidos
   * @throws UserNotFoundException si el usuario no existe
   * @throws InvalidPasswordException si la contraseña es incorrecta
   * @returns un objeto de usuario si el correo electrónico y la contraseña son válidos
   */
  async login(loginDto: LoginDto, ip: string): Promise<LoginResponse> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    const payload: JwtPayload = {
      username: user.username,
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
    return {
      access_token,
      refresh_token,
    };
  }

  async refresh(refreshToken: string, ip: string): Promise<LoginResponse> {
    const token = await this.userRepository.findRefreshToken(refreshToken);
    if (!token || token.expiresAt < new Date()) {
      throw new UnauthorizedException('Token de refresco inválido o expirado');
    }
    const user = await this.userRepository.findById(token.userId);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    // eliminar el token anterior
    await this.userRepository.deleteRefreshToken(refreshToken);
    // se genera un nuevo token
    const payload: JwtPayload = {
      username: user.username,
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
    return {
      access_token,
      refresh_token: newRefreshToken,
    };
  }
}
