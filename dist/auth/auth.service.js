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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const users_service_1 = require("../users/users.service");
const user_schema_1 = require("../users/schemas/user.schema");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const crypto_1 = require("crypto");
const email_service_1 = require("../email/email.service");
let AuthService = class AuthService {
    usersService;
    jwtService;
    userModel;
    emailService;
    constructor(usersService, jwtService, userModel, emailService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.userModel = userModel;
        this.emailService = emailService;
    }
    async validateUser(email, password) {
        const user = await this.usersService.findByEmail(email);
        if (user && await bcrypt.compare(password, user.password)) {
            const { password, ...result } = user.toObject();
            return result;
        }
        return null;
    }
    async create(createUserDto) {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const verificationToken = (0, crypto_1.randomBytes)(32).toString('hex');
        const user = new this.userModel({
            ...createUserDto,
            password: hashedPassword,
            isVerified: false,
            verificationToken,
        });
        const savedUser = await user.save();
        await this.emailService.sendVerificationEmail(savedUser.email, verificationToken);
        return savedUser;
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
    async verifyEmail(email, token) {
        const user = await this.usersService.findByEmail(email);
        if (!user || user.verificationToken !== token || !user.verificationTokenExpires || user.verificationTokenExpires < new Date()) {
            throw new common_1.BadRequestException('Invalid or expired verification token');
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();
        return { message: 'Email verified successfully' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        mongoose_2.Model,
        email_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map