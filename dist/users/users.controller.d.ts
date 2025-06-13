import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): any;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/user.schema").UserDocument, {}> & import("./schemas/user.schema").User & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    delete(id: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/user.schema").UserDocument, {}> & import("./schemas/user.schema").User & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
}
