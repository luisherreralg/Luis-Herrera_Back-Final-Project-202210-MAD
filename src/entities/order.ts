import { model, Schema, Types } from 'mongoose';

export type ProtoOrder = {
    size: string;
    cartedItem: Types.ObjectId;
    cartedBy: Types.ObjectId;
};

export type Order = {
    orderId: Types.ObjectId;
    size: string;
    cartedItem: Types.ObjectId;
    cartedBy: Types.ObjectId;
};

export const orderSchema = new Schema<Order>({
    size: String,
    cartedItem: {
        type: Schema.Types.ObjectId,
        ref: 'Sneaker',
    },
    cartedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
});

orderSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.orderId = returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject._id;
    },
});

export const OrderModel = model<Order>('Order', orderSchema, 'Orders');
