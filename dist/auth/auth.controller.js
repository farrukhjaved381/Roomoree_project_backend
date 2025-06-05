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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const login_dto_1 = require("./dto/login.dto");
const create_user_dto_1 = require("../users/dto/create-user.dto");
const mongoose_1 = require("@nestjs/mongoose");
const user_schema_1 = require("../users/schemas/user.schema");
const mongoose_2 = require("mongoose");
const crypto_1 = require("crypto");
const email_service_1 = require("../email/email.service");
let AuthController = class AuthController {
    authService;
    userModel;
    emailService;
    constructor(authService, userModel, emailService) {
        this.authService = authService;
        this.userModel = userModel;
        this.emailService = emailService;
    }
    async register(createUserDto) {
        return this.authService.create(createUserDto);
    }
    async login(loginDto) {
        return this.authService.login(loginDto);
    }
    async verifyEmail(token) {
        const user = await this.userModel.findOne({ verificationToken: token });
        if (!user) {
            throw new common_1.NotFoundException('Invalid or expired token');
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();
        return { message: 'Email successfully verified!' };
    }
    async resendVerification(email) {
        const user = await this.userModel.findOne({ email });
        if (!user || user.isVerified) {
            throw new common_1.BadRequestException('User not found or already verified');
        }
        const verificationToken = (0, crypto_1.randomBytes)(32).toString('hex');
        user.verificationToken = verificationToken;
        await user.save();
        await this.emailService.sendVerificationEmail(user.email, verificationToken);
        return { message: 'Verification email resent.' };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('verify-email'),
    __param(0, (0, common_1.Query)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyEmail", null);
__decorate([
    (0, common_1.Post)('resend-verification'),
    __param(0, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resendVerification", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        mongoose_2.Model,
        email_service_1.EmailService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map