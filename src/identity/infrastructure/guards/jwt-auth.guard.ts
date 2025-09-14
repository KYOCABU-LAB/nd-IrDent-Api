import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guardia para la autenticación con JWT
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
