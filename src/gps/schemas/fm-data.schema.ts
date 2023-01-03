import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type FMDataDocument = HydratedDocument<FMData>;

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

@Schema({ collection: 'fmData' })
export class FMData {
	@Prop({ required: true })
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

export const FMDataSchema = SchemaFactory.createForClass(FMData);
FMDataSchema.index({ vid: 1, time: 1 }, { unique: true });
