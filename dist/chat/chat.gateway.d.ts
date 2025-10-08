import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private clientSocketMap;
    private clientUserMap;
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    handleJoinRoom(room: string, client: Socket): void;
    handleLeaveRoomRoom(room: string, client: Socket): void;
    handleMessage(data: {
        user: string;
        room: string;
        message: string;
        timestamp: string;
        messageId: string;
        status: 'sending' | 'sent';
        file?: string;
        fileName?: string;
    }, client: Socket): Promise<{
        event: string;
        data: {
            status: string;
            user: string;
            room: string;
            message: string;
            timestamp: string;
            messageId: string;
            file?: string;
            fileName?: string;
        };
    }>;
    getAllConnectedUsers(): Promise<any[]>;
    handleRegisterUser(data: {
        clientId: string;
        username: string;
    }, client: Socket): void;
}
