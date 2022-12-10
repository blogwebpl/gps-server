import { MongoExceptionFilter } from './filters/mongo-exception.filter';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.setGlobalPrefix('api');
	app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
	app.useGlobalFilters(new MongoExceptionFilter());
	const port = app.get(ConfigService).get('PORT');
	await app.listen(port, () => {
		Logger.log(`HTTP(S) server is listening on port ${port}`);
	});
}
bootstrap();
