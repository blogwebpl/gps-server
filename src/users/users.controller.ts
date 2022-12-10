import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Get } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('users')
export class UsersController {
	constructor(public usersService: UsersService) {}

	@UseGuards(JwtAuthGuard)
	@Post()
	async screateUser(@Body() body: CreateUserDto) {
		const user = await this.usersService.create(body);
		user.password = undefined;
		return user;
	}

	@UseGuards(JwtAuthGuard)
	@Get()
	getAllUsers() {
		return this.usersService.findAll();
	}
}
