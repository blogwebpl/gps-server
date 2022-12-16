import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as argon from 'argon2';

@Injectable()
export class JwtRtStrategy extends PassportStrategy(Strategy, 'jwt-rt') {
	constructor(private usersService: UsersService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: process.env.REFRESH_TOKEN_SECRET,
			passReqToCallback: true,
		});
	}

	// TODO: remove any
	async validate(req: any, payload: { sub: string }) {
		const refreshToken = req.headers?.authorization?.replace('Bearer', '').trim();
		const user = await this.usersService.findWithToken(payload.sub);
		if (!user) {
			return false;
		}
		const isValid = await argon.verify(user.refreshToken, refreshToken);
		if (!isValid) {
			return false;
		}
		return { id: payload.sub };
	}
}
