import { DisputesService } from './disputes.service';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { ResolveDisputeDto } from './dto/resolve-dispute.dto';
export declare class DisputesController {
    private readonly disputesService;
    constructor(disputesService: DisputesService);
    createDispute(userId: string, dto: CreateDisputeDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/dispute.schema").Dispute, {}> & import("./schemas/dispute.schema").Dispute & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getAllDisputes(): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/dispute.schema").Dispute, {}> & import("./schemas/dispute.schema").Dispute & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    resolveDispute(id: string, dto: ResolveDisputeDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/dispute.schema").Dispute, {}> & import("./schemas/dispute.schema").Dispute & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
