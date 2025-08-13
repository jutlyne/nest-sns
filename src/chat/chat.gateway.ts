import {
	WebSocketGateway,
	SubscribeMessage,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	ConnectedSocket,
	WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: true, credentials: true } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server;

	private clientSocketMap = new Map<string, string>();
	private clientUserMap = new Map<string, string>();

	async handleConnection(client: Socket) {
		const clientId = client.handshake.query.clientId as string;

		if (!clientId) {
			console.error('No clientId provided');
			client.disconnect();
			return;
		}

		const oldSocketId = this.clientSocketMap.get(clientId);
		if (oldSocketId && oldSocketId !== client.id) {
			const oldSocket = this.server.sockets.sockets.get(oldSocketId);
			if (oldSocket) {
				console.log(`Kicking old connection for clientId=${clientId}`);
				oldSocket.disconnect();
			}
		}

		this.clientSocketMap.set(clientId, client.id);
		console.log(
			`Client connected: clientId=${clientId}, socketId=${client.id}`,
		);

		if (this.clientUserMap.has(clientId)) {
			const onlineUsers = Array.from(this.clientUserMap.entries()).map(
				([clientId, username]) => ({ clientId, username }),
			);
			this.server.emit('onlineUsers', onlineUsers);
		}
	}

	handleDisconnect(client: Socket) {
		const clientId = client.handshake.query.clientId as string;
		if (clientId && this.clientSocketMap.get(clientId) === client.id) {
			this.clientSocketMap.delete(clientId);
			this.clientUserMap.delete(clientId);

			const onlineUsers = Array.from(this.clientUserMap.entries()).map(
				([clientId, username]) => ({ clientId, username }),
			);
			this.server.emit('onlineUsers', onlineUsers);
			console.log(
				`Client disconnected: clientId=${clientId}, socketId=${client.id}`,
			);
		}
	}

	@SubscribeMessage('joinRoom')
	handleJoinRoom(
		@MessageBody() room: string,
		@ConnectedSocket() client: Socket,
	) {
		client.join(room);
		if (room !== 'demo-room') {
			this.server.emit('userJoined', client.handshake.query.clientId);
		}
	}

	@SubscribeMessage('leaveRoom')
	handleLeaveRoomRoom(
		@MessageBody() room: string,
		@ConnectedSocket() client: Socket,
	) {
		client.to(room).emit('endCall', { roomId: room });
		client.leave(room);
		if (room !== 'demo-room') {
			this.server.emit('userLeaved', client.handshake.query.clientId);
		}
	}

	@SubscribeMessage('message')
	async handleMessage(
		@MessageBody()
		data: {
			user: string;
			room: string;
			message: string;
			timestamp: string;
			messageId: string;
			status: 'sending' | 'sent';
			file?: string;
			fileName?: string;
		},
		@ConnectedSocket() client: Socket,
	) {
		await new Promise((resolve) => setTimeout(resolve, 500));

		const hasMessage = data.message && data.message.trim().length > 0;
		const hasFile = !!data.file;

		if (!hasMessage && !hasFile) {
			client.emit('error', { message: 'Message or file is required' });
			return;
		}

		// if (hasMessage && data.message.length > 100) {
		// 	client.emit('error', { message: 'Message too long' });
		// 	return;
		// }

		const sentData = { ...data, status: 'sent' };

		client.to(data.room).emit('message', sentData);

		return { event: 'message', data: sentData };
	}

	async getAllConnectedUsers(): Promise<any[]> {
		const sockets = await this.server.fetchSockets();

		return sockets.map((socket) => socket.id);
	}

	@SubscribeMessage('registerUser')
	handleRegisterUser(
		@MessageBody() data: { clientId: string; username: string },
		@ConnectedSocket() client: Socket,
	) {
		if (!data.clientId || !data.username) return;

		this.clientUserMap.set(data.clientId, data.username);

		console.log(
			`Registered user: clientId=${data.clientId}, username=${data.username}`,
		);

		const onlineUsers = Array.from(this.clientUserMap.entries()).map(
			([clientId, username]) => ({ clientId, username }),
		);
		this.server.emit('onlineUsers', onlineUsers);
	}
}
