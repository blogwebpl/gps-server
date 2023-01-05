import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../../users/schemas/users.schema';

export type UsersDevicesDocument = HydratedDocument<UsersDevice>;

@Schema()
export class UsersDevice {
	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users' })
	user: User;
	@Prop({ required: true })
	name: string;
	@Prop({ default: false })
	show: boolean;
	@Prop({ default: false })
	info: boolean;
	@Prop({ default: false })
	follow: boolean;
	@Prop({ required: true })
	vid: string;
}

export const UsersDevicesSchema = SchemaFactory.createForClass(UsersDevice);
