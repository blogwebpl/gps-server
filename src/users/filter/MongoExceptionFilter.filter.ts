import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { MongoError } from 'mongodb';
import { Response } from 'express';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
	catch(exception: MongoError, host: ArgumentsHost) {
		const context = host.switchToHttp();
		const response = context.getResponse<Response>();
		switch (exception.code) {
			case 11000:
				return response.status(409).json({
					statusCode: 409,
					message: exception.errmsg,
				});
		}
	}
}
