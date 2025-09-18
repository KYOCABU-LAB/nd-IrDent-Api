import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'src/identity/application/dto/auth.dto';
import { Request } from 'express';
import { getClientIp } from 'src/shared/utils/ip.utils';

/**
 * clase JwtStrategy para validar tokens
 *
 * @param payload  payload del token
 * @returns  objeto con el userId, username y roles
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Constructor de la clase
   * se le pasan las opciones para la validación del token
   *
   * @param payload  payload del token
   * @returns  objeto con el userId, username y roles que se obtienen del token
   */
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'irdent-secret-key',
      passReqToCallback: true,
    });
  }

  /**
   * Valida un token JWT y devuelve el usuario asociado al mismo
   * si el token es válido, se devuelve un objeto con el userId, username y roles
   * si el token no es válido, se lanza una excepción UnauthorizedException
   * @param req  solicitud HTTP
   * @param payload  payload del token JWT
   * @returns  objeto con el userId, username y roles que se obtienen del token
   * @throws UnauthorizedException si el token no es válido
   */
  async validate(req: Request, payload: JwtPayload) {
    const clientIp = getClientIp(req);

    if (payload.ip && payload.ip !== clientIp) {
      throw new UnauthorizedException('La dirección IP no coincide');
    }

    return {
      userId: payload.sub,
      email: payload.email,
      roles: payload.roles,
    };
  }
}
