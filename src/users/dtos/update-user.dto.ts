import { IsEmail, IsMongoId, IsOptional, IsString, MaxLength, ValidateIf } from 'class-validator';

import { ObjectId } from 'mongodb';

export class UpdateUserDto {
	@IsEmail()
	@ValidateIf((_object, value) => value !== undefined)
	email?: string;

	@IsString()
	@MaxLength(64)
	@ValidateIf((_object, value) => value !== undefined)
	password?: string;

	@IsString()
	@ValidateIf((_object, value) => value !== undefined)
	name?: string;

	@IsString()
	@ValidateIf((_object, value) => value !== undefined)
	role?: ObjectId;

	@IsMongoId({ each: true })
	// @Transform((params) => params.obj.roles.map((role: any) => role.toString()))
	roles?: ObjectId[];

	@IsString()
	@IsOptional()
	refreshToken?: string;
}
