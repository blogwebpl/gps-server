import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UsersSchema } from './schemas/users.schema';
import * as bcrypt from 'bcrypt';

@Module({
	imports: [
		MongooseModule.forFeatureAsync([
			{
				name: User.name,
				useFactory: () => {
					const schema = UsersSchema;
					schema.pre('save', async function () {
						if (this.isModified('password')) {
							const saltRounds = 12;
							const salt = await bcrypt.genSalt(saltRounds);
							const hash = await bcrypt.hash(this.password, salt);
							this.password = hash;
						}
					});
					return schema;
				},
			},
		]),
	],
	controllers: [UsersController],
	providers: [UsersService],
	exports: [UsersService],
})
export class UsersModule {}
