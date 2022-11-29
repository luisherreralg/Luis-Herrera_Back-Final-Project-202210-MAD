import { ProtoSneaker, SneakerModel } from '../../entities/sneaker.js';
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

const mockError = {
    message: undefined,
    statusCode: 503,
    statusMessage: 'Service unavailable',
};
