import { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import * as jwt from 'jsonwebtoken';
import { isValidObjectId } from 'mongoose';

interface Connection {
	userId: string;
	socket: Socket;
}

@WebSocketGateway()
@Injectable()
export class GatewayService implements OnGatewayConnection, OnGatewayDisconnect {
	private connections: Connection[] = [];

	handleConnection(client: Socket) {
		try {
			const token = client.handshake.headers.authorization.split(' ')[1];
			const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
			const userId = decoded.sub;
			if (!isValidObjectId(userId)) {
				client.disconnect();
				return;
			}
			this.connections.push({ userId: userId.toString(), socket: client });
			client.emit('userId', userId);
		} catch (error) {
			console.log(error);
			client.disconnect();
		}
	}

	handleDisconnect(client: Socket) {
		const index = this.connections.findIndex((connection) => connection.socket === client);
		if (index !== -1) {
			this.connections.splice(index, 1);
		}
	}

	sendDataToClient(clientId: string, event: string, data: any) {
		const connections = this.connections.filter((connection) => connection.userId === clientId);
		for (const connection of connections) {
			connection.socket.emit(event, data);
		}
	}
}
