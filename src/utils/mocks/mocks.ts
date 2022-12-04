import { Types } from 'mongoose';
import { OrderModel, ProtoOrder } from '../../entities/order.js';
import { ProtoSneaker, SneakerModel } from '../../entities/sneaker.js';
import { ProtoUser, UserModel } from '../../entities/user.js';
import { DbConnections } from '../db/db.connections.js';

const connections = DbConnections.getInstance();

export const mockSneakers: ProtoSneaker[] = [
    {
        brand: 'Test1',
        model: 'Test1',
        size: [],
        price: 0,
        onSalePrice: 0,
        onSale: false,
        stock: 0,
        gender: 'male',
        images: ['image1', 'image2'],
    },
    {
        brand: 'Test2',
        model: 'Test2',
        size: [],
        price: 0,
        onSalePrice: 0,
        onSale: false,
        stock: 0,
        gender: 'female',
        images: ['image1', 'image2'],
    },
];

export async function setUpSneakerCollection() {
    await connections.dbConnect();
    await SneakerModel.deleteMany();
    await SneakerModel.insertMany(mockSneakers);
    const data = await SneakerModel.find();
    return [data[0].id, data[1].id];
}

export const mockUsers: ProtoUser[] = [
    {
        name: 'Test1Name',
        surname: 'Test1Surname',
        email: 'Test1Email',
        password:
            '$2a$10$h3j8SBMBoq0ANKCBu9jHYuKyVb3PvWrfd2igIf9mFc0QVp2/bi5xW', // Test1Password
        role: 'user',
    },
    {
        name: 'Test2Name',
        surname: 'Test2Surname',
        email: 'Test2Email',
        password: 'Test2Password', // Test2Password
        role: 'user',
    },
];

export async function setUpUserCollection() {
    await connections.dbConnect();
    await UserModel.deleteMany();

    await UserModel.insertMany(mockUsers);
    const data = await UserModel.find();
    return [data[0].id, data[1].id];
}

export const mockError = {
    message: undefined,
    statusCode: 503,
    statusMessage: 'Service unavailable',
};

export const mockOrders: ProtoOrder[] = [
    {
        size: '40.5',
        cartedItem: new Types.ObjectId(),
        cartedBy: new Types.ObjectId(),
    },
    {
        size: '41',
        cartedItem: new Types.ObjectId(),
        cartedBy: new Types.ObjectId(),
    },
];

export async function setUpOrderCollection() {
    await connections.dbConnect();
    await OrderModel.deleteMany();
    await OrderModel.insertMany(mockOrders);
    const data = await OrderModel.find();
    return {
        orderIds: [data[0].id, data[1].id],
        userIds: [data[0].cartedBy, data[1].cartedBy],
        sneakerIds: [data[0].cartedItem, data[1].cartedItem],
    };
}

export const payloadMock = (userId: string) => {
    return {
        id: userId,
        name: 'TestName',
        role: 'admin',
    };
};
