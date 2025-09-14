import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from '../dto/create-user.dto';
import {
  UserRepository,
  CreateUserData,
} from '../../domain/repositories/user-repository.interface';
import { RoleService } from './role.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleService: RoleService,
  ) {}

  async createUser(dto: CreateUserDto) {
    const existingUser = await this.userRepository.findByUsername(dto.username);
    if (existingUser) {
      throw new BadRequestException('El nombre de usuario ya existe');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const role = await this.roleService.getRoleByName(dto.roleName);
    if (!role) {
      throw new NotFoundException('Rol no encontrado');
    }

    const userData: CreateUserData = {
      username: dto.username,
      password_hash: hashedPassword,
      email: dto.email,
      nombre: dto.nombre,
      apellido: dto.apellido,
      telefono: dto.telefono || null,
      estado: 'ACTIVO',
    };

    const user = await this.userRepository.create(userData);

    await this.userRepository.assignRole(user.id, role.id);

    return user;
  }

  async findByUsername(username: string) {
    return this.userRepository.findByUsername(username);
  }
}
