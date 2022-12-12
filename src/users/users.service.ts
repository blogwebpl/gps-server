import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dtos/create-user.dto';
import { HttpException } from '@nestjs/common/exceptions/http.exception';

@Injectable()
export class UsersService {
	constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

	create(createUserDto: CreateUserDto): Promise<User> {
		const user = new this.userModel(createUserDto);
		return user.save();
	}

	async delete(userId: string) {
		const user = await this.userModel.findByIdAndDelete(userId).exec();
		if (!user) {
			throw new HttpException('User not found', 404);
		}
		return user;
	}

	async findOne(email: string) {
		const user = await this.userModel.findOne({ email }).exec();
		if (!user) {
			throw new HttpException('User not found', 404);
		}
		return user;
	}

	findAll(): Promise<User[]> {
		const users = this.userModel.find().exec();
		return users;
	}
}
