import { Document, Schema, HookNextFunction, model } from 'mongoose';

export type AccountType = 'usertype1' | 'usertype2' | 'usertype3' | 'usertype4' | 'usertype5';
export interface IUser {
    account: AccountType;
    email: string;
    name: string;
    idnumber: number;
    phone: string;
    password: string;
}

export interface IUserDocument extends IUser, Document {}

const user = new Schema<IUserDocument>(
    {
        account: {
            type: String,
            enum: ['usertype1', 'usertype2', 'usertype3', 'usertype4', 'usertype5'],
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        name: {
            type: String,
        },
        password: {
            type: String,
            required: true,
        },
    },
    { timestamps: { createdAt: 'createdat', updatedAt: 'updatedat' } }
);

// tslint:disable-next-line: only-arrow-functions
user.pre('aggregate', function(next: HookNextFunction) {
    this.pipeline().unshift(
        {
            $project: { id: '$_id', other: '$$ROOT' },
        },
        {
            $replaceRoot: { newRoot: { $mergeObjects: ['$$ROOT', '$other'] } },
        },
        {
            $project: { other: 0, _id: 0 },
        }
    );

    next();
});

export const User = model<IUserDocument>('users', user);
