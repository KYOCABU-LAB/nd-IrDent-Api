import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'src/identity/application/dto/auth.dto';

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
    });
  }

  /**
   * Método para validar el token
   *
   * @param payload  payload del token
   * @returns  objeto con el userId, username y roles que se obtienen del token
   */
  async validate(payload: JwtPayload) {
    return {
      userId: payload.sub,
      username: payload.username,
      roles: payload.roles,
    };
  }
}
