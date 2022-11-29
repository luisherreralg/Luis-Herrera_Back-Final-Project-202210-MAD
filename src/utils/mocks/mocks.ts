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
        password: 'Test1Password',
        role: 'user',
    },
    {
        name: 'Test2Name',
        surname: 'Test2Surname',
        email: 'Test2Email',
        password: 'Test2Password',
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
