import { IsEmail, IsOptional, IsString, MaxLength, ValidateIf } from 'class-validator';

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
	@IsOptional()
	refreshToken?: string;
}
