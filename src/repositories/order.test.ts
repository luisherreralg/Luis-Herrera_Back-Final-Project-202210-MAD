import { Types } from 'mongoose';
import { OrderModel } from '../entities/order';
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
        testIds = await setUpOrderCollection();
    });

    afterAll(async () => {
        connections.dbDisconnect();
    });

    describe('When find its invoked', () => {
        test('Then it should return the order associated to the order id', async () => {
            const result = await repo.find({ cartedBy: testIds.userIds[0] });
            expect(result.length).toBe(1);
        });

        test('Then if the user has no orders, it should return an error', async () => {
            expect(async () => {
                await repo.find({
                    cartedBy: new Types.ObjectId('638039af92303fd9b7a0cace'),
                });
            }).rejects.toThrow();
        });

        test('Then if it cant connect, it should return an error', () => {
            connections.dbDisconnect();
            expect(async () => {
                await repo.find({ cartedBy: testIds.userIds[0] });
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

        test('Then if there is no existing orders it should return an error', async () => {
            await OrderModel.deleteMany();
            expect(async () => {
                await repo.delete(
                    testIds.userIds[0].toString(),
                    testIds.sneakerIds[0].toString()
                );
            }).rejects.toThrow();
        });
    });

    describe('when the patch method is invoked', () => {
        it('should return the patched item if all is correct', async () => {
            const result = await repo.patch(
                testIds.userIds[0].toString(),
                testIds.sneakerIds[0].toString(),
                { amount: 40 }
            );

            expect(result.amount).toEqual(40);
        });

        it('should return an error if the user has no orders', async () => {
            repo.find = jest.fn().mockResolvedValue([]);
            expect(async () => {
                await repo.patch(
                    new Types.ObjectId('638039af92303fd9b7a0cace').toString(),
                    testIds.sneakerIds[0].toString(),
                    { amount: 40 }
                );
            }).rejects.toThrow();
        });

        it('should return an error if there is no existing orders', async () => {
            await OrderModel.deleteMany();
            expect(async () => {
                await repo.patch(
                    testIds.userIds[0].toString(),
                    testIds.sneakerIds[0].toString(),
                    { amount: 40 }
                );
            }).rejects.toThrow();
        });

        it('should return an error if there is no existing products', async () => {
            repo.find = jest.fn().mockResolvedValue([
                {
                    size: '50',
                    cartedItem: new Types.ObjectId(),
                    cartedBy: testIds.userIds[0],
                },
            ]);
            expect(async () => {
                await repo.patch(
                    testIds.userIds[0].toString(),
                    testIds.sneakerIds[0].toString(),
                    { amount: 40 }
                );
            }).rejects.toThrow();
        });
    });
});
