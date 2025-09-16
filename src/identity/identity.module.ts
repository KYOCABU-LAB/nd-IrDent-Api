import { Module, OnModuleInit } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { AuthService } from './application/services/auth.service';
import { RoleService } from './application/services/role.service';
import { UserService } from './application/services/user.service';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { JwtAuthGuard } from './infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from './infrastructure/guards/roles.guard';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { UserRepository } from './domain/repositories/user-repository.interface';
import { PrismaUserRepository } from './infrastructure/repositories/prisma-user.repository';
import { RoleRepository } from './domain/repositories/role-repository.interface';
import { PrismaRoleRepository } from './infrastructure/repositories/prisma-role.repository';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'irdent-secret-key',
      signOptions: { expiresIn: '60m' },
    }),
    PrismaModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    RoleService,
    UserService,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
    { provide: UserRepository, useClass: PrismaUserRepository },
    { provide: RoleRepository, useClass: PrismaRoleRepository },
  ],
  exports: [
    AuthService, 
    RoleService,
    UserService, 
    JwtAuthGuard, 
    RolesGuard,
  ],
})
export class IdentityModule implements OnModuleInit {
  constructor(
    private readonly roleService: RoleService,
    private readonly userService: UserService,
  ) {}

  async onModuleInit() {
    await this.roleService.initializeRoles();

    const adminUsername = 'admin';
    const existingAdmin = await this.userService.findByUsername(adminUsername);
    if (!existingAdmin) {
      const dto = {
        username: adminUsername,
        password: 'Admin123',
        email: 'admin@gmail.com',
        nombre: 'Admin',
        apellido: 'System',
        roleName: 'admin',
      };
      await this.userService.createUser(dto);
      console.log('Usuario por defecto creado');
    }
  }
}
