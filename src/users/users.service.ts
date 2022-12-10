import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
	constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

	async create(createUserDto: CreateUserDto): Promise<User> {
		const user = new this.userModel(createUserDto);
		return user.save();
	}

	async findOne(email: string): Promise<User> {
		const user = this.userModel.findOne({ email }).select('-__v').lean().exec();
		return user;
	}

	async findAll(): Promise<User[]> {
		const users = this.userModel.find().select({ name: 1, email: 1 }).select('-__v').lean().exec();
		return users;
	}
}
