import {
	ConnectedSocket,
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: true, credentials: true } })
export class CallGateway {
	@WebSocketServer()
	server: Server;

	@SubscribeMessage('offer')
	handleOffer(
		@MessageBody()
		data: {
			clientId: string;
			selectedRoom: string;
			data: RTCSessionDescriptionInit;
		},
		@ConnectedSocket() client: Socket,
	) {
		client.to(data.selectedRoom).emit('offer', {
			clientId: data.clientId,
			offer: data.data,
			room: data.selectedRoom,
		});
	}

	@SubscribeMessage('answer')
	handleAnswer(
		@MessageBody()
		data: {
			clientId: string;
			selectedRoom: string;
			data: RTCSessionDescriptionInit;
		},
		@ConnectedSocket() client: Socket,
	) {
		client.to(data.selectedRoom).emit('answer', {
			clientId: data.clientId,
			answer: data.data,
		});
	}

	@SubscribeMessage('iceCandidate')
	handleIceCandidate(
		@MessageBody()
		data: {
			clientId: string;
			selectedRoom: string;
			data: RTCSessionDescriptionInit;
		},
		@ConnectedSocket() client: Socket,
	) {
		client.to(data.selectedRoom).emit('iceCandidate', {
			clientId: data.clientId,
			candidate: data.data,
		});
	}
}
