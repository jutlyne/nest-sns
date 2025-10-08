"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let ChatGateway = class ChatGateway {
    constructor() {
        this.clientSocketMap = new Map();
        this.clientUserMap = new Map();
    }
    async handleConnection(client) {
        const clientId = client.handshake.query.clientId;
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
        console.log(`Client connected: clientId=${clientId}, socketId=${client.id}`);
        if (this.clientUserMap.has(clientId)) {
            const onlineUsers = Array.from(this.clientUserMap.entries()).map(([clientId, username]) => ({ clientId, username }));
            this.server.emit('onlineUsers', onlineUsers);
        }
    }
    handleDisconnect(client) {
        const clientId = client.handshake.query.clientId;
        if (clientId && this.clientSocketMap.get(clientId) === client.id) {
            this.clientSocketMap.delete(clientId);
            this.clientUserMap.delete(clientId);
            const onlineUsers = Array.from(this.clientUserMap.entries()).map(([clientId, username]) => ({ clientId, username }));
            this.server.emit('onlineUsers', onlineUsers);
            console.log(`Client disconnected: clientId=${clientId}, socketId=${client.id}`);
        }
    }
    handleJoinRoom(room, client) {
        client.join(room);
        if (room !== 'demo-room') {
            this.server.emit('userJoined', client.handshake.query.clientId);
        }
    }
    handleLeaveRoomRoom(room, client) {
        client.to(room).emit('endCall', { roomId: room });
        client.leave(room);
        if (room !== 'demo-room') {
            this.server.emit('userLeaved', client.handshake.query.clientId);
        }
    }
    async handleMessage(data, client) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const hasMessage = data.message && data.message.trim().length > 0;
        const hasFile = !!data.file;
        if (!hasMessage && !hasFile) {
            client.emit('error', { message: 'Message or file is required' });
            return;
        }
        const sentData = { ...data, status: 'sent' };
        client.to(data.room).emit('message', sentData);
        return { event: 'message', data: sentData };
    }
    async getAllConnectedUsers() {
        const sockets = await this.server.fetchSockets();
        return sockets.map((socket) => socket.id);
    }
    handleRegisterUser(data, client) {
        if (!data.clientId || !data.username)
            return;
        this.clientUserMap.set(data.clientId, data.username);
        console.log(`Registered user: clientId=${data.clientId}, username=${data.username}`);
        const onlineUsers = Array.from(this.clientUserMap.entries()).map(([clientId, username]) => ({ clientId, username }));
        this.server.emit('onlineUsers', onlineUsers);
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinRoom'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leaveRoom'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleLeaveRoomRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('message'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('registerUser'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleRegisterUser", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: { origin: true, credentials: true } })
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map