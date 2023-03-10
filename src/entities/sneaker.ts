import { model, Schema, Types } from 'mongoose';

export type Sizes =
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
    brand?: string;
    model?: string;
    size?: Sizes[];
    price?: number;
    onSalePrice?: number;
    onSale?: 'onSale' | 'notOnSale';
    stock?: number;
    gender?: 'hombre' | 'mujer';
    images?: string[];
};

export type Sneaker = {
    id: Types.ObjectId;
    brand: string;
    model: string;
    size: Sizes[];
    price: number;
    onSalePrice: number;
    onSale: 'onSale' | 'notOnSale';
    stock: number;
    gender: 'hombre' | 'mujer';
    images: string[];
};

export const sneakerSchema = new Schema<Sneaker>({
    brand: { type: String, required: true },
    model: { type: String, required: true },
    size: { type: [String], required: true },
    price: { type: Number, required: true },
    onSalePrice: { type: Number, required: true },
    onSale: { type: String, required: true },
    stock: { type: Number, required: true },
    gender: { type: String, required: true },
    images: { type: [String], required: true },
});

sneakerSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject._id;
    },
});

export const SneakerModel = model<Sneaker>(
    'Sneaker',
    sneakerSchema,
    'Sneakers'
);
