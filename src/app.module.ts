import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { RolesModule } from './roles/roles.module';
import { GatewayModule } from './gateway/gateway.module';
import { GpsModule } from './gps/gps.module';
import { UsersDevicesModule } from './users-devices/users-devices.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: `.env.${process.env.NODE_ENV}`,
		}),
		MongooseModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (config: ConfigService) => {
				return { uri: config.get<string>('MONGODB_URI') };
			},
		}),
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', 'client'),
		}),
		UsersModule,
		AuthModule,
		RolesModule,
		GatewayModule,
		GpsModule,
		UsersDevicesModule,
	],
	controllers: [AppController],
})
export class AppModule {}
