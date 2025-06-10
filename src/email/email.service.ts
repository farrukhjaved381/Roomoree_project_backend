import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  async sendVerificationEmail(to: string, token: string) {
    const url = `http://localhost:3000/auth/verify-email?token=${token}`;
    console.log('Sending email to:', to);
    console.log('Verification URL:', url); // ✅ This should match token in DB

    await this.transporter.sendMail({
      from: `"Roomoree" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Verify your email',
      text: `Click to verify your account: ${url}`,
      html: `<p>Click to verify your account: <a href="${url}">${url}</a></p>`,
    });
  }
  async sendResetPasswordEmail(to: string, url: string) {
    await this.transporter.sendMail({
      from: `"Roomoree" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Reset your Roomoree password',
      html: `<p>Click the link to reset your password: <a href="${url}">${url}</a></p>`,
    });
  }
  
}
