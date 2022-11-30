import { Types } from 'mongoose';
import { DbConnections } from '../utils/db/db.connections';
import { mockOrders, setUpOrderCollection } from '../utils/mocks/mocks';
import { OrderRepository } from './order';

describe('Given a singleton instance of the class "OrderRepository"', () => {
    const mockData = mockOrders;
    const connections = DbConnections.getInstance();
    const repo = OrderRepository.getInstance();

    let testIds: {
        orderIds: Types.ObjectId[];
        userIds: Types.ObjectId[];
        sneakerIds: Types.ObjectId[];
    };

    beforeEach(async () => {
        connections.dbConnect();
        testIds = await setUpOrderCollection();
    });

    afterAll(async () => {
        connections.dbDisconnect();
    });

    describe('When find its invoked', () => {
        // TODO: Fix this test
        // test('Then it should return the orders owned by a user', async () => {
        //     console.log(
        //         "🚀 ~ file: order.test.ts:29 ~ OrderRepository', ~ test ~ testIds.userIds[0]",
        //         testIds.userIds[0]
        //     );

        //     const result = await repo.find(testIds.userIds[0]);
        //     expect(result.length).toBe(2);
        // });

        test('Then if the user has no orders, it should return an error', async () => {
            expect(async () => {
                await repo.find(new Types.ObjectId('638039af92303fd9b7a0cace'));
            }).rejects.toThrow();
        });

        test('Then if it cant connect, it should return an error', () => {
            connections.dbDisconnect();
            expect(async () => {
                await repo.find(testIds.orderIds[0]);
            }).rejects.toThrow();
        });
    });

    describe('When post is invoked', () => {
        const newOrder = {
            size: '50',
            cartedItem: new Types.ObjectId(),
            cartedBy: new Types.ObjectId(),
            amount: 0,
        };

        test('Then it should return the order created', async () => {
            const result = await repo.post(newOrder);
            expect(result.size).toEqual(newOrder.size);
        });

        test('Then if it cant connect, it should return an error', () => {
            connections.dbDisconnect();
            expect(async () => {
                await repo.post(mockData[0]);
            }).rejects.toThrow();
        });
    });

    describe('When delete is invoked', () => {
        test('Then if it deletes an item, it should return the deleted item', async () => {
            const result = await repo.delete(
                testIds.userIds[0].toString(),
                testIds.sneakerIds[0].toString()
            );
            expect(result.size).toEqual(mockData[0].size);
        });

        test('Then if the user has no orders, it should return an error', async () => {
            expect(async () => {
                await repo.delete(
                    new Types.ObjectId('638039af92303fd9b7a0cace').toString(),
                    testIds.sneakerIds[0].toString()
                );
            }).rejects.toThrow();
        });
    });
});
