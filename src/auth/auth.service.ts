import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserDocument } from '../users/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email) as UserDocument;
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async register(createUserDto: CreateUserDto): Promise<{ message: string }> {
    const { email } = createUserDto;

    const existingUser = await this.usersService.findByEmail(email);
    const verificationToken = randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    let user;

    if (existingUser && existingUser.isVerified) {
      throw new BadRequestException('User already registered and verified');
    }

    if (existingUser) {
      existingUser.verificationToken = verificationToken;
      existingUser.verificationTokenExpires = verificationTokenExpires;
      await existingUser.save();
      user = existingUser;
    } else {
      // Pass token into createUserDto explicitly
      const userDtoWithToken: any = {
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
    } catch (error) {
      console.error('Email sending failed:', error);
      throw new InternalServerErrorException('Failed to send verification email');
    }

    return { message: 'User registered. Please verify your email.' };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email) as UserDocument;
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    if (!user.isVerified) {
      throw new UnauthorizedException('Please verify your email before logging in');
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
  async sendPasswordResetEmail(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new BadRequestException('User not found');
  
    const resetToken = randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetExpires;
    await user.save();
  
    const resetLink = `http://localhost:3000/auth/reset-password?token=${resetToken}`;
    await this.emailService.sendResetPasswordEmail(user.email, resetLink);
  
    return { message: 'Reset link sent to email' };
  }
  
  async resetPassword(token: string, newPassword: string) {
    const user = await this.usersService.findByResetToken(token);
    if (!user) throw new BadRequestException('Invalid or expired token');
  
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
  
    return { message: 'Password updated successfully' };
  }
  
}
