import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  BadRequestException,
  UnauthorizedException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserRole } from '../users/schemas/user.schema';
import { Model } from 'mongoose';
import { randomBytes } from 'crypto';
import { EmailService } from '../email/email.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthGuard } from '@nestjs/passport';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private jwtService: JwtService,
    private readonly authService: AuthService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly emailService: EmailService,
    private usersService: UsersService,
  ) { }

  // 👉 Register simple user (email/password)
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const verificationToken = randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

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

  // 👉 Login (must be verified)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // 👉 Email Verification
  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    console.log('Verifying token:', token);

    const user = await this.userModel.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired token');
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    return { message: 'Email successfully verified!' };
  }

  // 👉 Resend Verification
  @Post('resend-verification')
  async resendVerification(@Body('email') email: string) {
    const user = await this.userModel.findOne({ email });

    if (!user || user.isVerified) {
      throw new BadRequestException('User not found or already verified');
    }

    const verificationToken = randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.verificationToken = verificationToken;
    user.verificationTokenExpires = verificationTokenExpires;
    await user.save();

    console.log('Resending verification email to:', user.email);
    console.log('New token:', verificationToken);

    await this.emailService.sendVerificationEmail(user.email, verificationToken);
    return { message: 'Verification email resent.' };
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.authService.sendPasswordResetEmail(body.email);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: ResetPasswordDto) {
    return this.authService.resetPassword(body.token, body.newPassword);
  }

  // 👉 Google OAuth Entry
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // redirect handled by passport
  }

  // 👉 Google OAuth Callback
  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    const { email, name } = req.user;
    let user = await this.usersService.findByEmail(email);

    if (!user) {
      // New Google user
      const verificationToken = randomBytes(32).toString('hex');
      const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

      user = await this.usersService.create({
        email,
        name,
        password: '',
        role: UserRole.GUEST,
        isVerified: false,
        verificationToken,
        verificationTokenExpires,
      });

      console.log('Created Google user. Token:', verificationToken);
      await this.emailService.sendVerificationEmail(email, verificationToken);
    } else if (!user.isVerified) {
      // Unverified Google user — update token
      const verificationToken = randomBytes(32).toString('hex');
      const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

      user.verificationToken = verificationToken;
      user.verificationTokenExpires = verificationTokenExpires;
      await user.save();

      console.log('Resent Google user token:', verificationToken);
      await this.emailService.sendVerificationEmail(email, verificationToken);
    }

    // Prevent login until verified
    if (!user.isVerified) {
      throw new UnauthorizedException('Please verify your email before logging in.');
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
}

































































