import { IsEmail, IsString, MaxLength, IsArray } from 'class-validator';

export class CreateUserDto {
	@IsEmail()
	email: string;

	@IsString()
	@MaxLength(64)
	password: string;

	@IsString()
	name: string;

	@IsString()
	role: string;

	@IsArray()
	roles: string[];
}
