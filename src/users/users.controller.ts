import { UpdateUserDto } from './dtos/update-user.dto';
import { Body, Controller, Delete, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Get } from '@nestjs/common';
import { JwtAccessTokenGuard } from '../auth/jwt-access-token.guard';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDto } from './dtos/user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { Patch } from '@nestjs/common/decorators';

@Controller('users')
@Serialize(UserDto)
export class UsersController {
	constructor(public usersService: UsersService) {}

	@UseGuards(JwtAccessTokenGuard)
	@Post()
	async screateUser(@Body() body: CreateUserDto) {
		const user = await this.usersService.create(body);
		return user;
	}

	@UseGuards(JwtAccessTokenGuard)
	@Patch(':userId')
	updateUser(@Param('userId') userId: string, @Body() changes: UpdateUserDto) {
		return this.usersService.update(userId, changes);
	}

	@UseGuards(JwtAccessTokenGuard)
	@Get()
	getAllUsers() {
		return this.usersService.findAll();
	}

	@UseGuards(JwtAccessTokenGuard)
	@Delete(':userId')
	@HttpCode(204)
	delUser(@Param('userId') userId: string) {
		return this.usersService.delete(userId);
	}
}
