import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  GUEST = 'guest',
  HOST = 'host',
  ADMIN = 'admin',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ enum: UserRole, default: UserRole.GUEST })
  role: UserRole;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ required: false })
  verificationToken?: string;

  @Prop({ required: false })
  verificationTokenExpires?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
