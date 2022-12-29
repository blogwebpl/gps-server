import { Injectable, Logger } from '@nestjs/common';
import * as net from 'net';

@Injectable()
export class GpsService {
	private server: net.Server;
	private logger = new Logger(GpsService.name);

	constructor() {
		this.server = net.createServer((socket) => {
			this.logger.log('New client connected');

			// Odbieranie danych od klienta
			socket.on('data', (data) => {
				this.logger.log(`Received data: ${data}`);
			});

			// Zamykanie połączenia
			socket.on('end', () => {
				this.logger.log('Client disconnected');
			});
		});
	}

	startServer() {
		this.server.listen(5005, () => {
			this.logger.log('Server listening on port 5005');
		});
	}
}
