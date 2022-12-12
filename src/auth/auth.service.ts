/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(private usersService: UsersService, private jwtService: JwtService) {}

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

	async login(user: any) {
		const payload = { sub: user._id };
		return {
			access_token: this.jwtService.sign(payload),
		};
	}
}
