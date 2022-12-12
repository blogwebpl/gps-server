import { UpdateUserDto } from './dtos/update-user.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dtos/create-user.dto';
import { HttpException } from '@nestjs/common/exceptions/http.exception';

@Injectable()
export class UsersService {
	constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

	private checkId(id: string) {
		if (!isValidObjectId(id)) {
			throw new HttpException('Invalid user id', 400);
		}
	}

	private userNotFoundException() {
		throw new HttpException('User not found', 404);
	}

	create(createUserDto: CreateUserDto): Promise<User> {
		const user = new this.userModel(createUserDto);
		return user.save();
	}

	async update(userId: string, changes: UpdateUserDto) {
		this.checkId(userId);
		return this.userModel.findByIdAndUpdate(userId, changes, { new: true });
	}

	async delete(userId: string) {
		this.checkId(userId);
		const user = await this.userModel.findByIdAndDelete(userId).exec();
		if (!user) this.userNotFoundException();
		return user;
	}

	async findByEmail(email: string) {
		const user = await this.userModel.findOne({ email }).exec();
		if (!user) this.userNotFoundException();
		return user;
	}

	findAll(): Promise<User[]> {
		const users = this.userModel.find().exec();
		return users;
	}
}
