import { UsersDevice, UsersDevicesDocument } from './schemas/users-devices.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersDevicesService {
	constructor(
		@InjectModel(UsersDevice.name) private usersDeviceModel: Model<UsersDevicesDocument>
	) {}

	async getUsersWithVid(vid: string) {
		return await this.usersDeviceModel.find({ vid }).select('user').exec();
	}
}
