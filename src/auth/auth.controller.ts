import { Controller, Post, Body, Get, Query, NotFoundException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Model } from 'mongoose';
import { randomBytes } from 'crypto';
import { EmailService } from '../email/email.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly emailService: EmailService,
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    const user = await this.userModel.findOne({ verificationToken: token });

    if (!user) {
      throw new NotFoundException('Invalid or expired token');
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    return { message: 'Email successfully verified!' };
  }

  @Post('resend-verification')
async resendVerification(@Body('email') email: string) {
  const user = await this.userModel.findOne({ email });

  if (!user || user.isVerified) {
    throw new BadRequestException('User not found or already verified');
  }

  const verificationToken = randomBytes(32).toString('hex');
  user.verificationToken = verificationToken;
  await user.save();

  await this.emailService.sendVerificationEmail(user.email, verificationToken);

  return { message: 'Verification email resent.' };
}

}

