import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DeviceDocument = HydratedDocument<Device>;

@Schema()
export class Device {
	@Prop({ required: true, index: true, unique: true })
	imei: string;
	@Prop({ required: true, default: false })
	allow: boolean;
	@Prop({ default: '' })
	name: string;
	@Prop({ default: '' })
	sim: string;
	@Prop({ required: true, index: true })
	vehicleId: string;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
