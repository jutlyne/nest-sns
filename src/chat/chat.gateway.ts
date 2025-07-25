import { AllConfigType } from '@/config/config.interface';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
	WebSocketGateway,
	SubscribeMessage,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: true, credentials: true } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		private readonly configService: ConfigService<AllConfigType>,
		private readonly jwtService: JwtService,
	) {}

	async handleConnection(client: Socket) {
		try {
			const cookieHeader = client.handshake.headers.cookie;
			if (!cookieHeader) throw new UnauthorizedException('No cookie');

			const token = this.extractTokenFromCookie(cookieHeader);
			if (!token) throw new UnauthorizedException('No token in cookie');

			const payload = this.jwtService.verify(token, {
				secret: this.configService.getOrThrow<string>('auth.secret', {
					infer: true,
				}),
			});
			client.data.user = payload;

			console.log(`Socket connected: userId=${payload.id}`);
		} catch (err) {
			console.error('Socket auth failed:', err.message);
			client.disconnect();
		}
	}

	private extractTokenFromCookie(cookie: string): string | null {
		const match = cookie.match(/token=([^;]+)/);
		return match ? match[1] : null;
	}

	handleDisconnect(client: Socket) {
		console.log(`Client disconnected: ${client.id}`);
	}

	@SubscribeMessage('joinRoom')
	handleJoinRoom(
		@MessageBody() room: string,
		@ConnectedSocket() client: Socket,
	) {
		client.join(room);
	}

	@SubscribeMessage('message')
	async handleMessage(
		@MessageBody()
		data: {
			room: string;
			user: string;
			message: string;
			timestamp: string;
			messageId: string;
		},
		@ConnectedSocket() client: Socket,
	) {
		await new Promise((resolve) => setTimeout(resolve, 1500));

		if (!data.message || data.message.trim().length === 0) {
			client.emit('error', { message: 'Message cannot be empty' });
			return;
		}

		if (data.message.length > 10) {
			client.emit('error', { message: 'Message too long' });
			return;
		}

		const sentData = { ...data, status: 'sent' };

		client.to(data.room).emit('message', sentData);

		return { event: 'message', data: sentData };
	}
}
