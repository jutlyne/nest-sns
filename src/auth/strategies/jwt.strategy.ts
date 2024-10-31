import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '@/config/config.interface';
import { JwtPayloadInterface } from './interfaces/jwt-payload.interface';
import { OrNeverType } from '@/utils/interfaces/or-never.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService<AllConfigType>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('auth.secret', {
        infer: true,
      }),
    });
  }

  public validate(payload: JwtPayloadInterface): OrNeverType<JwtPayloadInterface> {
    if (!payload.id) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
