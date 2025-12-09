import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import { UsersRepository } from '../repository/users.repository';

export interface JwtPayload {
    sub: string; // user id
    userId: string;
    iat?: number;
    exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private readonly usersRepository: UsersRepository,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                // 1. 쿠키에서 토큰 추출 (우선순위 높음)
                (request: any) => {
                    if (request && request.cookies && request.cookies.accessToken) {
                        return request.cookies.accessToken;
                    }
                    return null;
                },
                // 2. Authorization 헤더에서 토큰 추출
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET') || 'TEMP_KEY_BUT_WILL_FAIL',
        });

        if (!configService.get<string>('JWT_SECRET')) {
            throw new Error('FATAL ERROR: JWT_SECRET environment variable is not defined.');
        }
    }

    async validate(payload: JwtPayload) {
        const user = await this.usersRepository.findById(payload.sub);

        if (!user) {
            throw new UnauthorizedException('유효하지 않은 토큰입니다.');
        }

        return {
            id: user.id,
            userId: user.userId,
        };
    }
}
