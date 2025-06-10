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
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const passport_1 = require("@nestjs/passport");
const forgot_password_dto_1 = require("./dto/forgot-password.dto");
const reset_password_dto_1 = require("./dto/reset-password.dto");
const swagger_1 = require("@nestjs/swagger");
let AuthController = class AuthController {
    jwtService;
    authService;
    userModel;
    emailService;
    usersService;
    constructor(jwtService, authService, userModel, emailService, usersService) {
        this.jwtService = jwtService;
        this.authService = authService;
        this.userModel = userModel;
        this.emailService = emailService;
        this.usersService = usersService;
    }
    async register(createUserDto) {
        const verificationToken = (0, crypto_1.randomBytes)(32).toString('hex');
        const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const user = await this.usersService.create({
            ...createUserDto,
            verificationToken,
            verificationTokenExpires,
            isVerified: false,
        });
        console.log('Sending verification to:', user.email);
        console.log('Token stored:', verificationToken);
        await this.emailService.sendVerificationEmail(user.email, verificationToken);
        return { message: 'User registered. Verification email sent.' };
    }
    async login(loginDto) {
        return this.authService.login(loginDto);
    }
    async verifyEmail(token) {
        console.log('Verifying token:', token);
        const user = await this.userModel.findOne({
            verificationToken: token,
            verificationTokenExpires: { $gt: new Date() },
        });
        if (!user) {
            throw new common_1.BadRequestException('Invalid or expired token');
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();
        return { message: 'Email successfully verified!' };
    }
    async resendVerification(email) {
        const user = await this.userModel.findOne({ email });
        if (!user || user.isVerified) {
            throw new common_1.BadRequestException('User not found or already verified');
        }
        const verificationToken = (0, crypto_1.randomBytes)(32).toString('hex');
        const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        user.verificationToken = verificationToken;
        user.verificationTokenExpires = verificationTokenExpires;
        await user.save();
        console.log('Resending verification email to:', user.email);
        console.log('New token:', verificationToken);
        await this.emailService.sendVerificationEmail(user.email, verificationToken);
        return { message: 'Verification email resent.' };
    }
    async forgotPassword(body) {
        return this.authService.sendPasswordResetEmail(body.email);
    }
    async resetPassword(body) {
        return this.authService.resetPassword(body.token, body.newPassword);
    }
    async googleAuth() {
    }
    async googleAuthRedirect(req) {
        const { email, name } = req.user;
        let user = await this.usersService.findByEmail(email);
        if (!user) {
            const verificationToken = (0, crypto_1.randomBytes)(32).toString('hex');
            const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
            user = await this.usersService.create({
                email,
                name,
                password: '',
                role: user_schema_1.UserRole.GUEST,
                isVerified: false,
                verificationToken,
                verificationTokenExpires,
            });
            console.log('Created Google user. Token:', verificationToken);
            await this.emailService.sendVerificationEmail(email, verificationToken);
        }
        else if (!user.isVerified) {
            const verificationToken = (0, crypto_1.randomBytes)(32).toString('hex');
            const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
            user.verificationToken = verificationToken;
            user.verificationTokenExpires = verificationTokenExpires;
            await user.save();
            console.log('Resent Google user token:', verificationToken);
            await this.emailService.sendVerificationEmail(email, verificationToken);
        }
        if (!user.isVerified) {
            throw new common_1.UnauthorizedException('Please verify your email before logging in.');
        }
        const payload = { sub: user._id, email: user.email, role: user.role };
        const accessToken = this.jwtService.sign(payload);
        return {
            access_token: accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
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
__decorate([
    (0, common_1.Post)('forgot-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Get)('google'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuth", null);
__decorate([
    (0, common_1.Get)('google/redirect'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuthRedirect", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('auth'),
    __param(2, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        auth_service_1.AuthService,
        mongoose_2.Model,
        email_service_1.EmailService,
        users_service_1.UsersService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map