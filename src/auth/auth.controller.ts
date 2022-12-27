import { Controller, Request, Post, UseGuards, Get, HttpCode } from '@nestjs/common';
import { Serialize } from '../interceptors/serialize.interceptor';
import { RoleDto } from '../roles/dto/role.dto';
import { AuthService } from './auth.service';
import { JwtAccessTokenGuard } from './jwt-access-token.guard';
import { JwtRefreshTokenGuard } from './jwt-refresh-token.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

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
	@Get('profile')
	getProfile(@Request() req) {
		return req.user;
	}

	@UseGuards(JwtAccessTokenGuard)
	@Get('roles')
	@Serialize(RoleDto)
	getRoles(@Request() req) {
		return this.authService.getRoles(req.user.id);
	}

	@UseGuards(JwtRefreshTokenGuard)
	@Post('refresh')
	refreshToken(@Request() req) {
		return this.authService.generateNewTokens(req.user.id);
	}
}
