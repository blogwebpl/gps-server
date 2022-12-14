import { Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import * as jwt from 'jsonwebtoken';
import { isValidObjectId } from 'mongoose';

interface Connection {
	userId: string;
	socket: Socket;
}

@WebSocketGateway({ cors: true })
@Injectable()
export class GatewayService implements OnGatewayConnection, OnGatewayDisconnect {
	private connections: Connection[] = [];
	private logger = new Logger(GatewayService.name);

	handleConnection(client: Socket) {
		try {
			this.logger.log('handleConnection');
			const token = client.handshake.headers.authorization.split(' ')[1];
			const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
			const userId = decoded.sub;
			if (!isValidObjectId(userId)) {
				client.disconnect();
				return;
			}
			this.connections.push({ userId: userId.toString(), socket: client });
			client.emit('userId', userId);
			this.logger.log(`WebSocket connected ${client.id}`);
		} catch (error) {
			this.logger.log(error);
			client.disconnect();
		}
	}

	handleDisconnect(client: Socket) {
		const index = this.connections.findIndex((connection) => connection.socket === client);
		if (index !== -1) {
			this.connections.splice(index, 1);
		}
		this.logger.log(`Socket disconnected ${client.id}`);
	}

	sendDataToUser(userId: string, event: string, data: any) {
		this.logger.log('Send data to user');
		try {
			const connections = this.connections.filter((connection) => connection.userId === userId);
			for (const connection of connections) {
				connection.socket.emit(event, data);
			}
		} catch (_err) {
			this.logger.log('Send data to user error');
		}
	}
}
