import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

interface LoginDto {
  username: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });
    if (user && (await bcrypt.compare(password, user.password_hash))) {
      const { password_hash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const payload = {
      username: user.username,
      sub: user.id,
      roles: user.userRoles.map((ur) => ur.role.name),
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
