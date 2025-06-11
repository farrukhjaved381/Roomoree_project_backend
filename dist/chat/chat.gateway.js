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
const common_1 = require("@nestjs/common");
const jwt = require("jsonwebtoken");
const config_1 = require("@nestjs/config");
const chat_service_1 = require("./chat.service");
const mongoose_1 = require("mongoose");
let ChatGateway = class ChatGateway {
    configService;
    chatService;
    constructor(configService, chatService) {
        this.configService = configService;
        this.chatService = chatService;
    }
    logger = new common_1.Logger('ChatGateway');
    users = new Map();
    handleConnection(socket) {
        const token = socket.handshake.auth?.token || socket.handshake.query?.token;
        const secret = this.configService.get('JWT_SECRET');
        if (!secret) {
            this.logger.error('JWT_SECRET is not set');
            socket.disconnect();
            return;
        }
        try {
            const decoded = jwt.verify(token, secret);
            const userId = decoded.sub;
            this.users.set(socket.id, userId);
            socket.data.userId = userId;
            this.logger.log(`User connected: ${userId}`);
        }
        catch (err) {
            this.logger.warn('Socket auth failed');
            socket.disconnect();
        }
    }
    handleDisconnect(socket) {
        const userId = this.users.get(socket.id);
        this.users.delete(socket.id);
        this.logger.log(`User disconnected: ${userId}`);
    }
    handleJoinRoom(roomId, socket) {
        socket.join(roomId);
        this.logger.log(`${this.users.get(socket.id)} joined room ${roomId}`);
    }
    async handleMessage(payload, socket) {
        const senderId = socket.data.userId;
        if (!mongoose_1.default.isValidObjectId(payload.receiver)) {
            this.logger.warn('Invalid receiver ID');
            return;
        }
        if (!mongoose_1.default.isValidObjectId(payload.room)) {
            this.logger.warn('Invalid room ID');
            return;
        }
        console.log('📤 Message received from socket:', {
            senderId,
            ...payload,
        });
        const saved = await this.chatService.saveMessage({
            sender: senderId,
            receiver: payload.receiver,
            room: payload.room,
            text: payload.message,
        });
        console.log('💾 Message saved in DB:', saved);
        const messageToSend = {
            sender: senderId,
            text: payload.message,
            room: payload.room,
            createdAt: new Date(),
        };
        socket.to(payload.room).emit('message', messageToSend);
        socket.emit('message', messageToSend);
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.SubscribeMessage)('joinRoom'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('message'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMessage", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [config_1.ConfigService,
        chat_service_1.ChatService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map