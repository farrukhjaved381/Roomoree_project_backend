import { Document, Types } from 'mongoose';
export declare class Dispute extends Document {
    user: Types.ObjectId;
    booking: Types.ObjectId;
    reason: string;
    status: string;
    resolutionNote?: string;
}
export declare const DisputeSchema: import("mongoose").Schema<Dispute, import("mongoose").Model<Dispute, any, any, any, Document<unknown, any, Dispute, any> & Dispute & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Dispute, Document<unknown, {}, import("mongoose").FlatRecord<Dispute>, {}> & import("mongoose").FlatRecord<Dispute> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
