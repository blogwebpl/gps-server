import { UsersDevice, UsersDevicesDocument } from './schemas/users-devices.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersDevicesService {
	constructor(
		@InjectModel(UsersDevice.name) private usersDeviceModel: Model<UsersDevicesDocument>
	) {}

	async getUsersIdWithVid(vid: string) {
		const usersDevices = await this.usersDeviceModel.find({ vid }).lean().exec();
		const users = usersDevices.map((ud) => ud.user.toString());
		return users;
	}
}
