import { Controller, Request, Post, UseGuards, Get, HttpCode, Patch, Body } from '@nestjs/common';
import { Serialize } from '../interceptors/serialize.interceptor';
import { RoleDto } from '../roles/dtos/role.dto';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { UpdateUserRoleDto } from './dtos/update-user-role';
import { JwtAccessTokenGuard } from './jwt-access-token.guard';
import { JwtRefreshTokenGuard } from './jwt-refresh-token.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService, private usersService: UsersService) {}

	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(@Request() req) {
		return this.authService.login(req.user);
	}

	@UseGuards(JwtAccessTokenGuard)
	@Post('logout')
	@HttpCode(204)
	async logout(@Request() req) {
		const { id } = req.user;
		return this.authService.logout(id);
	}

	@UseGuards(JwtAccessTokenGuard)
	@Get('roles')
	@Serialize(RoleDto)
	getUserRoles(@Request() req) {
		return this.authService.getUserRoles(req.user.id);
	}

	@UseGuards(JwtAccessTokenGuard)
	@Patch()
	setUserRole(@Request() req, @Body() changes: UpdateUserRoleDto) {
		return this.usersService.update(req.user.id, changes);
	}

	@UseGuards(JwtRefreshTokenGuard)
	@Post('refresh')
	refreshToken(@Request() req) {
		return this.authService.generateNewTokens(req.user.id);
	}
}
