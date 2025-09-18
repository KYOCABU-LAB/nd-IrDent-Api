import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  Logger,
} from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import type { Request } from 'express';
import { AuthService } from 'src/identity/application/services/auth.service';
import { LoginDto } from 'src/identity/application/dto/auth.dto';
import { Roles } from '../decorators/roles.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { getClientIp } from 'src/shared/utils/ip.utils';

@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 intentos por minuto
  @HttpCode(HttpStatus.OK)
  async login(@Req() req: Request, @Body() loginDto: LoginDto) {
    const clientIp = getClientIp(req);

    this.logger.log(
      `Iniciando proceso de login para email: ${loginDto.email} desde IP: ${clientIp}`,
    );

    try {
      const result = await this.authService.login(loginDto, clientIp);

      return result;
    } catch (error) {
      this.logger.warn(
        `Login fallido para email: ${loginDto.email} desde IP: ${clientIp} - ${error.message}`,
      );
      throw error;
    }
  }
  @Post('admin-test')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  async Admin() {
    return 'usuario con rol admin';
  }

  @Post('refresh')
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 refresh por minuto
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Body() { refresh_token }: { refresh_token: string },
  ) {
    const clientIp = getClientIp(req);

    this.logger.log(`Intento de refresh token desde IP: ${clientIp}`);
    try {
      const result = await this.authService.refresh(refresh_token, clientIp);
      this.logger.log(`Refresh token exitoso desde IP: ${clientIp}`);
      return result;
    } catch (error) {
      this.logger.warn(
        `Refresh token fallido desde IP: ${clientIp} - ${error.message}`,
      );
      throw error;
    }
  }
}
