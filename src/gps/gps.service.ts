import { Injectable, Logger } from '@nestjs/common';
import * as net from 'net';

@Injectable()
export class GpsService {
	private server: net.Server;
	private logger = new Logger(GpsService.name);

	constructor() {
		this.server = net.createServer((socket) => {
			console.log('New client connected');

			// Odbieranie danych od klienta
			socket.on('data', (data) => {
				console.log(`Received data: ${data}`);
			});

			// Zamykanie połączenia
			socket.on('end', () => {
				console.log('Client disconnected');
			});
		});
	}

	startServer() {
		this.server.listen(5005, () => {
			this.logger.log('Server listening on port 5005');
		});
	}
}
