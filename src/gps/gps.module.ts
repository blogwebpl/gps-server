import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FMData, FMDataSchema } from './schemas/fm-data.schema';
import { FMLast, FMLastSchema } from './schemas/fm-last.schema';
import { Device, DeviceSchema } from './schemas/devices.schema';
import { GpsService } from './gps.service';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: FMData.name,
				schema: FMDataSchema,
			},
			{
				name: FMLast.name,
				schema: FMLastSchema,
			},
			{
				name: Device.name,
				schema: DeviceSchema,
			},
		]),
	],
	providers: [GpsService],
	exports: [GpsService],
})
export class GpsModule {}
