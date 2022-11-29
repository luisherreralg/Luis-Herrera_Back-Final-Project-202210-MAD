import { ProtoUser } from '../entities/user';
import { DbConnections } from '../utils/db/db.connections';
import { mockUsers, setUpUserCollection } from '../utils/mocks/mocks';
import { UserRepository } from './user';

describe('Given a singleton instance of the class "UserRepository"', () => {
    const mockData = mockUsers;
    const connections = DbConnections.getInstance();
    const repo = UserRepository.getInstance();
    let testIds: string[];

    beforeEach(async () => {
        connections.dbConnect();
        testIds = await setUpUserCollection();
    });

    afterEach(async () => {
        connections.dbDisconnect();
    });

    describe('When get its invoked', () => {
        test('Then it should return the correct user', async () => {
            const result = await repo.get(testIds[0]);
            expect(result.name).toBe(mockData[0].name);
        });

        test('If the id is not found should throw an error', () => {
            expect(async () => {
                await repo.get('');
            }).rejects.toThrow();
        });

        test('If the connection to mongo does not work, it should throw an error', () => {
            connections.dbDisconnect();
            expect(async () => {
                await repo.get(testIds[0]);
            }).rejects.toThrow();
        });
    });

    describe('When post its invoked', () => {
        test('Then if all is ok it should return a posted item', async () => {
            const newUser: ProtoUser = {
                name: 'NewUser',
                surname: 'NewUser',
                email: 'NewUser',
                password: 'NewUser',
                role: 'user',
            };
            const result = await repo.post(newUser);

            expect(result.name).toEqual(newUser.name);
        });

        test('Then if the email is already in use it should throw an error', async () => {
            const newUser: ProtoUser = {
                name: 'NewUser',
                surname: 'NewUser',
                email: 'Test1Email',
                password: 'NewUser',
                role: 'user',
            };
            expect(async () => {
                await repo.post(newUser);
            }).rejects.toThrowError();
        });
    });

    describe('When search its invoked', () => {
        test('Then if the query is valid, it should return a search of items', async () => {
            const result = await repo.search('Test1Name');
            expect(result.length).toBe(1);
        });

        test('Then if the query is not valid, it should return an empty array', async () => {
            const result = await repo.search('Manuel');
            expect(result).toEqual([]);
        });
    });
});
