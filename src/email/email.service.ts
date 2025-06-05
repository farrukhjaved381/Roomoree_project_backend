import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail', // or 'mailtrap.io' SMTP
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  async sendVerificationEmail(to: string, token: string) {
    const url = `http://localhost:3000/auth/verify-email?token=${token}`;
  
    await this.transporter.sendMail({
      from: `"Roomoree" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Verify your Roomoree email',
      html: `<p>Click the link to verify your account: <a href="${url}">${url}</a></p>`,
    });
  }
  
}
