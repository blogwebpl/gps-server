import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
	@Prop({ required: true, unique: true, trim: true, index: true })
	email: string;
	@Prop({ required: true })
	password: string;
	@Prop({ trim: true })
	name: string;
	@Prop({ required: false })
	refreshToken: string;
}

export const UsersSchema = SchemaFactory.createForClass(User);
