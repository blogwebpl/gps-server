import { IsString } from 'class-validator';

import { ObjectId } from 'mongodb';

export class UpdateUserRoleDto {
	@IsString()
	role?: ObjectId;
}
