import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type FMLastDocument = HydratedDocument<FMLast>;

@Schema()
class Gps {
	@Prop({ default: [0, 0], index: '2dsphere' })
	pos: [number];
	@Prop({ min: -500, max: 5000 })
	alt: number;
	@Prop({ min: 0, max: 359 })
	ang: number;
	@Prop({ min: 0, max: 32 })
	sat: number;
	@Prop({ min: 0, max: 2500 })
	spd: number;
}

@Schema({ collection: 'fmLast' })
export class FMLast {
	@Prop({ required: true, index: true, unique: true })
	vid: string;
	@Prop({ required: true })
	time: Date;
	@Prop({ type: Gps })
	gps: Gps;
	@Prop()
	st: Date;
	@Prop()
	io: [[number, mongoose.Schema.Types.Mixed]];
}

export const FMLastSchema = SchemaFactory.createForClass(FMLast);
