import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { Get } from '@nestjs/common';

@Controller('users')
export class UsersController {
	constructor(public usersService: UsersService) {}

	@Get()
	getAllUsers() {
		return this.usersService.findAll();
	}
}
