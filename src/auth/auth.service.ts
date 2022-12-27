/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Logger } from '@nestjs/common';
import { User, UserDocument } from 'src/users/schemas/users.schema';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RolesService } from '../roles/roles.service';

export interface Tokens {
	accessToken: string;
	refreshToken: string;
}

@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private rolesService: RolesService,
		private jwtService: JwtService,
		private config: ConfigService
	) {}

	async validateUser(email: string, password: string): Promise<User> {
		const user = await this.usersService.findByEmail(email);
		if (!user) {
			return null;
		}

		const isValidPassword = await bcrypt.compare(password, user.password);
		if (isValidPassword) {
			return user;
		}
		return null;
	}

	async login(user: UserDocument) {
		const userId = user._id;
		const tokens = await this.generateNewTokens(userId.toString());
		return {
			...tokens,
			email: user.email,
			role: user.role,
		};
	}

	async logout(userId: string) {
		await this.usersService.update(userId, { refreshToken: null });
	}

	async updateDbRefreshToken(userId: string, refreshToken: string): Promise<void> {
		const hash = await argon.hash(refreshToken);
		await this.usersService.update(userId, { refreshToken: hash });
	}

	getRoles(userId: string) {
		return this.rolesService.getRolesByUser(userId);
	}

	async getTokens(userId: string): Promise<Tokens> {
		const payload = { sub: userId };
		const [accessToken, refreshToken] = await Promise.all([
			this.jwtService.signAsync(payload, {
				secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
				expiresIn: this.config.get<string>('ACCESS_TOKEN_EXPIRES_IN'),
			}),
			this.jwtService.signAsync(payload, {
				secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
				expiresIn: this.config.get<string>('REFRESH_TOKEN_EXPIRES_IN'),
			}),
		]);
		return {
			accessToken,
			refreshToken,
		};
	}

	async generateNewTokens(userId: string) {
		const tokens = await this.getTokens(userId);
		await this.updateDbRefreshToken(userId, tokens.refreshToken);
		return tokens;
	}
}
