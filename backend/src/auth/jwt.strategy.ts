import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private readonly auth: AuthService,
    configService: ConfigService,
  ) {
    const secret = configService.get('JWT_SECRET') ?? 'fallback_secret';
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload) {
    this.logger.log(`Validating token for sub=${payload.sub}, email=${payload.email}`);
    const user = await this.auth.findById(payload.sub);
    if (!user) {
      this.logger.warn(`User not found for sub=${payload.sub}`);
      throw new UnauthorizedException();
    }
    this.logger.log(`User found: ${user.email}`);
    return user;
  }
}
