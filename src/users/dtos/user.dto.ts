import { Expose, Transform } from 'class-transformer';
import { ObjectId } from 'mongoose';

export class UserDto {
	@Expose()
	@Transform((params) => params.obj._id.toString())
	_id: ObjectId;

	@Expose()
	email: string;

	@Expose()
	name: string;

	@Expose()
	@Transform((params) => params.obj.role.toString())
	role: ObjectId;

	@Expose()
	@Transform((params) => params.obj.roles.map((role: ObjectId) => role.toString()))
	roles: ObjectId[];
}
