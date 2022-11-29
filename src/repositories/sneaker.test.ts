import { SneakerModel } from '../entities/sneaker';
import { DbConnections } from '../utils/db/db.connections';
import { mockSneakers, setUpSneakerCollection } from '../utils/mocks/mocks';
import { SneakerRepository } from './sneaker';

describe('Given a singleton instance of the class "SneakerRepository"', () => {
    const mockData = mockSneakers;
    const connections = DbConnections.getInstance();
    const repo = SneakerRepository.getInstance();
    let testIds: string[];

    // TODO: review lines 64 and 84
    beforeEach(async () => {
        connections.dbConnect();
        testIds = await setUpSneakerCollection();
    });

    afterAll(async () => {
        connections.dbDisconnect();
    });

    describe('When getAll its invoked', () => {
        test('Then it should return the sneakers in the collection', async () => {
            const result = await repo.getAll();
            expect(result.length).toBe(2);
        });

        test('Then if the collection its empty, it should return an error', async () => {
            await SneakerModel.deleteMany();

            expect(async () => {
                const test = await repo.getAll();
                console.log(test);
            }).rejects.toThrow('Empty collection');
        });

        test('Then if it cant connect, it should return an error', () => {
            connections.dbDisconnect();
            expect(async () => {
                await repo.getAll();
            }).rejects.toThrow();
        });
    });

    describe('When get its invoked', () => {
        test('If the id its valid, it should return the sneaker', async () => {
            const result = await repo.get(testIds[0]);
            expect(result.model).toBe(mockData[0].model);
        });

        test('If the id its not valid, it should return an error', async () => {
            expect(async () => {
                await repo.get('638539af92303fd9b7a0cace');
            }).rejects.toThrow();
        });
    });

    describe('When search its invoked', () => {
        test('Then if the query is valid, it should return a search of items', async () => {
            const result = await repo.search('Test1');
            expect(result.length).toBe(1);
        });

        test('Then if the query is empty, it should return an error', async () => {
            expect(async () => {
                await repo.search('');
            }).rejects.toThrow();
        });
    });

    describe('When post its invoked', () => {
        test('Then if the data is correct, it should return the new sneaker', async () => {
            await SneakerModel.deleteMany();
            const result = await repo.post(mockData[0]);
            expect(result.model).toBe(mockData[0].model);
        });

        test('Then if the data is incorrect, it should return an error', async () => {
            expect(async () => {
                await repo.post({
                    brand: 'Test1',
                    model: 'Test1',
                    size: [],
                    price: 0,
                    onSalePrice: 0,
                    onSale: false,
                    stock: 0,
                });
            }).rejects.toThrow();
        });
    });

    describe('When the patch its invoked', () => {
        test('If the daa is correct, it should return the updated sneaker', async () => {
            const result = await repo.patch(testIds[0], { model: 'Test3' });
            expect(result.model).toBe('Test3');
        });

        test('If the data is incorrect, it should return an error', async () => {
            expect(async () => {
                await repo.patch(testIds[0], { model: '' });
            }).rejects.toThrow();
        });
    });

    describe('When the delete its invoked', () => {
        test('If the id is correct, it should return the deleted sneaker', async () => {
            const result = await repo.delete(testIds[0]);
            console.log(result);
            expect(result).toBe(testIds[0]);
        });

        test('If the id its incorrect it should return an error', async () => {
            expect(async () => {
                await repo.delete('0');
            }).rejects.toThrow();
        });

        test('If the id its not valid it should return an error', async () => {
            expect(async () => {
                await repo.delete('638539af92303fd9b7a0cace');
            }).rejects.toThrow();
        });
    });
});
