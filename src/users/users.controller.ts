import { Body, Controller, Logger, Post, UseFilters, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Get } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateUserDto } from './dtos/create-user.dto';
import { MongoExceptionFilter } from './filter/MongoExceptionFilter.filter';

@Controller('users')
export class UsersController {
	constructor(public usersService: UsersService) {}

	@UseGuards(JwtAuthGuard)
	@UseFilters(MongoExceptionFilter)
	@Post()
	async screateUser(@Body() body: CreateUserDto) {
		const user = await this.usersService.create(body);
		user.password = undefined;
		return user;
	}

	@Get()
	getAllUsers() {
		return this.usersService.findAll();
	}
}
