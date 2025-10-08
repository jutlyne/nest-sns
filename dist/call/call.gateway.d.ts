import { Server, Socket } from 'socket.io';
export declare class CallGateway {
    server: Server;
    handleOffer(data: {
        clientId: string;
        selectedRoom: string;
        data: RTCSessionDescriptionInit;
    }, client: Socket): void;
    handleAnswer(data: {
        clientId: string;
        selectedRoom: string;
        data: RTCSessionDescriptionInit;
    }, client: Socket): void;
    handleIceCandidate(data: {
        clientId: string;
        selectedRoom: string;
        data: RTCSessionDescriptionInit;
    }, client: Socket): void;
}
