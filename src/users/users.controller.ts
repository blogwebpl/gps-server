import { Body, Controller, Delete, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Get } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDto } from './dtos/user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';

@Controller('users')
@Serialize(UserDto)
export class UsersController {
	constructor(public usersService: UsersService) {}

	@UseGuards(JwtAuthGuard)
	@Post()
	async screateUser(@Body() body: CreateUserDto) {
		const user = await this.usersService.create(body);
		return user;
	}

	@UseGuards(JwtAuthGuard)
	@Get()
	getAllUsers() {
		return this.usersService.findAll();
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':userId')
	@HttpCode(204)
	delUser(@Param('userId') userId: string) {
		return this.usersService.delete(userId);
	}
}
