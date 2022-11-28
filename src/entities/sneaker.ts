import { model, Schema, Types } from 'mongoose';

// Trying to type the sneaker possible sizes
type Sizes =
    | '40'
    | '40.5'
    | '41'
    | '41.5'
    | '42'
    | '42.5'
    | '43'
    | '43.5'
    | '44'
    | '44.5';

export type ProtoSneaker = {
    name?: string;
    brand?: string;
    model?: string;
    size?: Sizes[];
    price?: number;
    onSalePrice?: number;
    onSale?: boolean;
    stock?: number;
    gender?: string;
};

export type Sneaker = {
    id: Types.ObjectId;
    name: string;
    brand: string;
    model: string;
    size: Sizes[];
    price: number;
    onSalePrice: number;
    onSale: boolean;
    stock: number;
    gender: string;
};

export const sneakerSchema = new Schema<Sneaker>({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    size: { type: [String], required: true },
    price: { type: Number, required: true },
    onSalePrice: { type: Number, required: true },
    onSale: { type: Boolean, required: true },
    stock: { type: Number, required: true },
    gender: { type: String, required: true },
});

sneakerSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject._id;
        delete returnedObject.passwd;
    },
});

export const Sneaker = model<Sneaker>('Sneaker', sneakerSchema, 'Sneakers');
