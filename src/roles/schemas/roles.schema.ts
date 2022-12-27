import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RoleDocument = HydratedDocument<Role>;

@Schema()
export class Role {
	@Prop({ trim: true, unique: true })
	name: string;
}

export const RolesSchema = SchemaFactory.createForClass(Role);
