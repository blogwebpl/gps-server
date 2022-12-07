import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
	constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

	async findAll(): Promise<User[]> {
		const users = this.userModel.find().select({ name: 1, email: 1 }).exec();
		return users;
	}
}
