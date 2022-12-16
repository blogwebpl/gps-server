import { IsEmail, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
	@IsEmail()
	email: string;

	@IsString()
	@MaxLength(64)
	password: string;

	@IsString()
	name: string;
}
