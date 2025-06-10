"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
let EmailService = class EmailService {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    async sendVerificationEmail(to, token) {
        const url = `http://localhost:3000/auth/verify-email?token=${token}`;
        console.log('Sending email to:', to);
        console.log('Verification URL:', url);
        await this.transporter.sendMail({
            from: `"Roomoree" <${process.env.EMAIL_USER}>`,
            to,
            subject: 'Verify your email',
            text: `Click to verify your account: ${url}`,
            html: `<p>Click to verify your account: <a href="${url}">${url}</a></p>`,
        });
    }
    async sendResetPasswordEmail(to, url) {
        await this.transporter.sendMail({
            from: `"Roomoree" <${process.env.EMAIL_USER}>`,
            to,
            subject: 'Reset your Roomoree password',
            html: `<p>Click the link to reset your password: <a href="${url}">${url}</a></p>`,
        });
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)()
], EmailService);
//# sourceMappingURL=email.service.js.map