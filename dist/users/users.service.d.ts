import { Model } from 'mongoose';
import { UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    findByEmail(email: string): Promise<UserDocument | null>;
    findAll(): Promise<UserDocument[]>;
    create(createUserDto: CreateUserDto): Promise<UserDocument>;
    findByResetToken(token: string): Promise<UserDocument | null>;
}
