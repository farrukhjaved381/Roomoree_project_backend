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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const email_service_1 = require("../email/email.service");
const bcrypt = require("bcrypt");
const crypto_1 = require("crypto");
let AuthService = class AuthService {
    usersService;
    jwtService;
    emailService;
    constructor(usersService, jwtService, emailService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }
    async validateUser(email, password) {
        const user = await this.usersService.findByEmail(email);
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user.toObject();
            return result;
        }
        return null;
    }
    async register(createUserDto) {
        const { email } = createUserDto;
        const existingUser = await this.usersService.findByEmail(email);
        const verificationToken = (0, crypto_1.randomBytes)(32).toString('hex');
        const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        let user;
        if (existingUser && existingUser.isVerified) {
            throw new common_1.BadRequestException('User already registered and verified');
        }
        if (existingUser) {
            existingUser.verificationToken = verificationToken;
            existingUser.verificationTokenExpires = verificationTokenExpires;
            await existingUser.save();
            user = existingUser;
        }
        else {
            const userDtoWithToken = {
                ...createUserDto,
                verificationToken,
                verificationTokenExpires,
                isVerified: false,
            };
            user = await this.usersService.create(userDtoWithToken);
        }
        console.log('Registering user:', user.email);
        console.log('Using token:', verificationToken);
        try {
            await this.emailService.sendVerificationEmail(user.email, verificationToken);
        }
        catch (error) {
            console.error('Email sending failed:', error);
            throw new common_1.InternalServerErrorException('Failed to send verification email');
        }
        return { message: 'User registered. Please verify your email.' };
    }
    async login(loginDto) {
        const user = await this.usersService.findByEmail(loginDto.email);
        if (!user)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const isMatch = await bcrypt.compare(loginDto.password, user.password);
        if (!isMatch)
            throw new common_1.UnauthorizedException('Invalid credentials');
        if (!user.isVerified) {
            throw new common_1.UnauthorizedException('Please verify your email before logging in');
        }
        const payload = { sub: user._id, email: user.email, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    }
    async sendPasswordResetEmail(email) {
        const user = await this.usersService.findByEmail(email);
        if (!user)
            throw new common_1.BadRequestException('User not found');
        const resetToken = (0, crypto_1.randomBytes)(32).toString('hex');
        const resetExpires = new Date(Date.now() + 60 * 60 * 1000);
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetExpires;
        await user.save();
        const resetLink = `http://localhost:3000/auth/reset-password?token=${resetToken}`;
        await this.emailService.sendResetPasswordEmail(user.email, resetLink);
        return { message: 'Reset link sent to email' };
    }
    async resetPassword(token, newPassword) {
        const user = await this.usersService.findByResetToken(token);
        if (!user)
            throw new common_1.BadRequestException('Invalid or expired token');
        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        return { message: 'Password updated successfully' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        email_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map