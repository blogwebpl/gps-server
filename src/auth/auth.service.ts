/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
	constructor(private usersService: UsersService) {}

	async validateUser(email: string, password: string): Promise<User> {
		const user = await this.usersService.findOne(email);
		if (!user) {
			return null;
		}

		const isValidPassword = await bcrypt.compare(password, user.password);
		if (isValidPassword) {
			return user;
		}
		return null;
	}
}
