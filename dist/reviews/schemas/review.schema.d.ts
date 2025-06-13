import mongoose, { Document } from 'mongoose';
export type ReviewDocument = Review & Document;
export declare class Review {
    reviewer: mongoose.Types.ObjectId;
    reviewee: mongoose.Types.ObjectId;
    booking: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
}
export declare const ReviewSchema: mongoose.Schema<Review, mongoose.Model<Review, any, any, any, mongoose.Document<unknown, any, Review, any> & Review & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Review, mongoose.Document<unknown, {}, mongoose.FlatRecord<Review>, {}> & mongoose.FlatRecord<Review> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
