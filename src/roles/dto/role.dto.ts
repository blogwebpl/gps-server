import { Expose, Transform } from 'class-transformer';
import { ObjectId } from 'mongoose';

export class RoleDto {
	@Expose()
	@Transform((params) => params.obj._id.toString())
	_id: ObjectId;

	@Expose()
	name: string;
}
