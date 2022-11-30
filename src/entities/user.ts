import { model, Schema, Types } from 'mongoose';

export type ProtoUser = {
    name?: string;
    surname?: string;
    email?: string;
    password?: string;
    role?: 'user' | 'admin';
};

export type User = {
    id: Types.ObjectId;
    name: string;
    surname: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
};

export const userSchema = new Schema<User>({
    name: {
        type: String,
        required: true,
    },
    surname: String,
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: String,
    role: String,
});

userSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject._id;
        delete returnedObject.password;
    },
});

export const UserModel = model<User>('User', userSchema, 'Users');
