import { Dispute } from './schemas/dispute.schema';
import { Model } from 'mongoose';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { ResolveDisputeDto } from './dto/resolve-dispute.dto';
export declare class DisputesService {
    private disputeModel;
    constructor(disputeModel: Model<Dispute>);
    createDispute(userId: string, dto: CreateDisputeDto): Promise<import("mongoose").Document<unknown, {}, Dispute, {}> & Dispute & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getAllDisputes(): Promise<(import("mongoose").Document<unknown, {}, Dispute, {}> & Dispute & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getDisputeById(id: string): Promise<import("mongoose").Document<unknown, {}, Dispute, {}> & Dispute & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    resolveDispute(id: string, dto: ResolveDisputeDto): Promise<import("mongoose").Document<unknown, {}, Dispute, {}> & Dispute & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
