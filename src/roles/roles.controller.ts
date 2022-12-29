import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAccessTokenGuard } from '../auth/jwt-access-token.guard';
import { Serialize } from '../interceptors/serialize.interceptor';
import { RoleDto } from './dtos/role.dto';
import { RolesService } from './roles.service';

@Controller('roles')
@Serialize(RoleDto)
export class RolesController {
	constructor(public rolesService: RolesService) {}

	@UseGuards(JwtAccessTokenGuard)
	@Get()
	getAllRoles() {
		return this.rolesService.findAll();
	}

	@UseGuards(JwtAccessTokenGuard)
	@Get('/by-user/:userId')
	getRolesByUser(@Param('userId') userId: string) {
		return this.rolesService.getRolesByUser(userId);
	}
}
