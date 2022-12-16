import { UpdateUserDto } from './dtos/update-user.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/users.schema';
import { CreateUserDto } from './dtos/create-user.dto';
import { HttpException } from '@nestjs/common/exceptions/http.exception';

@Injectable()
export class UsersService {
	constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

	private validateId(id: string) {
		if (!isValidObjectId(id)) {
			throw new HttpException('Invalid user id', 400);
		}
	}

	private userNotFoundException() {
		throw new HttpException('User not found', 404);
	}

	private userUnauthorizedException() {
		throw new HttpException('User unauthorized', 401);
	}

	create(createUserDto: CreateUserDto): Promise<User> {
		const user = new this.userModel(createUserDto);
		return user.save();
	}

	async update(userId: string, changes: UpdateUserDto) {
		this.validateId(userId);
		const user = await this.userModel.findById(userId);
		Object.assign(user, changes);
		user.save();
		return user;
	}

	async delete(userId: string) {
		this.validateId(userId);
		const user = await this.userModel.findByIdAndDelete(userId).exec();
		if (!user) this.userNotFoundException();
		return user;
	}

	async findByEmail(email: string) {
		const user = await this.userModel.findOne({ email }).exec();
		if (!user) this.userNotFoundException();
		return user;
	}

	async findWithToken(userId: string) {
		const user = await this.userModel.findOne({ _id: userId, refreshToken: { $ne: null } }).exec();
		if (!user) this.userUnauthorizedException();
		return user;
	}

	findAll(): Promise<User[]> {
		const users = this.userModel.find().exec();
		return users;
	}
}
