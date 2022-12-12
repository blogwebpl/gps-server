import { IsEmail, IsString, ValidateIf } from 'class-validator';

export class UpdateUserDto {
	@IsEmail()
	@ValidateIf((_object, value) => value !== undefined)
	email: string;

	@IsString()
	@ValidateIf((_object, value) => value !== undefined)
	password: string;

	@IsString()
	@ValidateIf((_object, value) => value !== undefined)
	name: string;
}
