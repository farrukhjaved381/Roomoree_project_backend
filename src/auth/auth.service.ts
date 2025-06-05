import { Injectable, UnauthorizedException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User, UserDocument } from '../users/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { randomBytes } from 'crypto';
import { EmailService } from '../email/email.service';


@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly emailService: EmailService, // ✅ add this
  ) {}
  

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email) as UserDocument;
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const verificationToken = randomBytes(32).toString('hex');
  
    const user = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
      isVerified: false,
      verificationToken,
    });
  
    const savedUser = await user.save();
  
    // ✅ Send verification email
    await this.emailService.sendVerificationEmail(savedUser.email, verificationToken);
  
    return savedUser;
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

  async verifyEmail(email: string, token: string): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(email) as UserDocument;
    if (!user || user.verificationToken !== token || !user.verificationTokenExpires || user.verificationTokenExpires < new Date()) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    return { message: 'Email verified successfully' };
  }
}