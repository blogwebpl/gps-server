import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { Role, RolesSchema } from './schemas/roles.schema';

@Module({
	imports: [
		UsersModule,
		MongooseModule.forFeature([
			{
				name: Role.name,
				schema: RolesSchema,
			},
		]),
	],
	controllers: [RolesController],
	providers: [RolesService],
	exports: [RolesService],
})
export class RolesModule {}
