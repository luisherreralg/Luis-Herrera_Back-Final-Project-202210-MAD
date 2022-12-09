import mongoose from 'mongoose';
import { DbConnections } from './db.connections';

describe('Given a singleton instance of the class "DbConnections"', () => {
    const connections = DbConnections.getInstance();
    const spiConnect = jest.spyOn(mongoose, 'connect');

    describe('When the dbConnect method is invoked', () => {
        afterEach(async () => {
            await mongoose.disconnect();
        });

        test('Then it should return a type of mongoose', async () => {
            const result = await connections.dbConnect();
            expect(typeof result).toBe(typeof mongoose);
            mongoose.disconnect();
        });

        test('When the NODE_ENV is not "test"', async () => {
            process.env.NODE_ENV = 'development';
            const result = await connections.dbConnect();
            expect(spiConnect).toHaveBeenCalled();
            expect(typeof result).toBe(typeof mongoose);
            expect(result.connection.db.databaseName).toBe('Sneakers');
        });

        test('When the NODE_ENV is  "test"', async () => {
            process.env.NODE_ENV = 'test';
            const result = await connections.dbConnect();
            expect(spiConnect).toHaveBeenCalled();
            expect(typeof result).toBe(typeof mongoose);
            expect(result.connection.db.databaseName).toBe('SneakersTesting');
        });
    });

    describe('When the dbDisconnect method is invoked', () => {
        test('Then it should a ready state = 0', async () => {
            await connections.dbConnect();
            const result = await connections.dbDisconnect();
            expect(result).toBe(0);
        });
    });
});
