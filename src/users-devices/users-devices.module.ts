import { Module } from '@nestjs/common';
import { UsersDevicesService } from './users-devices.service';
import { UsersDevicesController } from './users-devices.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersDevice, UsersDevicesSchema } from './schemas/users-devices.schema';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: UsersDevice.name,
				schema: UsersDevicesSchema,
			},
		]),
	],
	controllers: [UsersDevicesController],
	providers: [UsersDevicesService],
	exports: [UsersDevicesService],
})
export class UsersDevicesModule {}
