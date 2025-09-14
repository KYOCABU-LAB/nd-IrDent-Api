import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../../domain/repositories/user-repository.interface';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from '../dto/auth.dto';
import {
  UserNotFoundException,
  InvalidPasswordException,
} from '../exceptions/auth.exceptions';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  /**
   *  Validar un usuario por su nombre de usuario y contraseña
   * @param username nombre de usuario
   * @param password contraseña
   * @returns un objeto de usuario si el nombre de usuario y la contraseña son válidos
   * @throws UserNotFoundException si el usuario no existe
   * @throws InvalidPasswordException si la contraseña es incorrecta
   * @returns un objeto de usuario si el nombre de usuario y la contraseña son válidos
   */
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userRepository.findByUsername(username);
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
   *  Iniciar sesión con un nombre de usuario y contraseña
   * @param loginDto objeto de inicio de sesión
   * @returns un objeto de usuario si el nombre de usuario y la contraseña son válidos
   * @throws UserNotFoundException si el usuario no existe
   * @throws InvalidPasswordException si la contraseña es incorrecta
   * @returns un objeto de usuario si el nombre de usuario y la contraseña son válidos
   */
  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    const payload = {
      username: user.username,
      sub: user.id,
      roles: user.UserRole.map((ur) => ur.role.name),
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
