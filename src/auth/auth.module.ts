import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtAtStrategy } from './jwt.at.strategy';
import { JwtRtStrategy } from './jwt.rt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { RolesModule } from '../roles/roles.module';

@Module({
	imports: [UsersModule, RolesModule, PassportModule, JwtModule.register({})],
	providers: [AuthService, LocalStrategy, JwtAtStrategy, JwtRtStrategy],
	exports: [AuthService],
	controllers: [AuthController],
})
export class AuthModule {}
