import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFeedback {
    userId?: mongoose.Types.ObjectId;
    name: string;
    email: string;
    rating: number;
    comment: string;
    isFeatured: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

interface IFeedbackDocument extends IFeedback, Document { }

const feedbackSchema = new Schema<IFeedbackDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            trim: true,
        },
        rating: {
            type: Number,
            required: [true, 'Rating is required'],
            min: [1, 'Rating must be at least 1'],
            max: [5, 'Rating cannot exceed 5'],
        },
        comment: {
            type: String,
            required: [true, 'Comment is required'],
            trim: true,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: (doc, ret: any) => {
                ret.id = ret._id.toString();
                delete ret._id;
                delete ret.__v;
                return ret;
            },
        },
    }
);

const Feedback: Model<IFeedbackDocument> = mongoose.model<IFeedbackDocument>(
    'Feedback',
    feedbackSchema
);

export default Feedback;
