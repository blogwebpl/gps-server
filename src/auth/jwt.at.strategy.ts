import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtAtStrategy extends PassportStrategy(Strategy, 'jwt-at') {
	constructor(private usersService: UsersService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: process.env.ACCESS_TOKEN_SECRET,
		});
	}

	async validate(payload: { sub: string }) {
		const user = await this.usersService.findWithToken(payload.sub);
		if (!user) {
			return false;
		}
		return { id: payload.sub };
	}
}
