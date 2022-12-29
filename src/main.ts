import { MongoExceptionFilter } from './filters/mongo-exception.filter';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GpsService } from './gps/gps.service';

async function bootstrap() {
	const logger = new Logger('HTTP(S)');
	const app = await NestFactory.create(AppModule, { cors: true });
	app.setGlobalPrefix('api');
	app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
	app.useGlobalFilters(new MongoExceptionFilter());
	app.get(GpsService).startServer();
	const port = app.get(ConfigService).get('PORT');
	await app.listen(port, () => {
		logger.log(`Server listening on port ${port}`);
	});
}
bootstrap();
