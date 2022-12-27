import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { Role, RoleDocument } from './schemas/roles.schema';

@Injectable()
export class RolesService {
	constructor(
		@InjectModel(Role.name) private roleModel: Model<RoleDocument>,
		private usersService: UsersService
	) {}
	findAll(): Promise<Role[]> {
		const roles = this.roleModel.find().exec();
		return roles;
	}
	async getRolesByUser(userId: string): Promise<Role[]> {
		const user = await this.usersService.findById(userId);
		const userRoles = user.roles;
		const roles = this.roleModel.find({ _id: { $in: userRoles } });
		return roles;
	}
}
