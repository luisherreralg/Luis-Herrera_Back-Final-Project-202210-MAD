import { ProtoUser } from '../entities/user';
import { DbConnections } from '../utils/db/db.connections';
import { mockUsers, setUpUserCollection } from '../utils/mocks/mocks';
import { UserRepository } from './user';

describe('Given a singleton instance of the class "UserRepository"', () => {
    const mockData = mockUsers;
    const connections = DbConnections.getInstance();
    const repo = UserRepository.getInstance();

    beforeEach(async () => {
        connections.dbConnect();
        await setUpUserCollection();
    });

    afterEach(async () => {
        connections.dbDisconnect();
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

        it('Then if the post data its empty, it should throw an error', async () => {
            expect(async () => {
                await repo.post({});
            }).rejects.toThrowError();
        });
    });

    describe('When search its invoked', () => {
        test('Then if the query is valid, it should return a search of items', async () => {
            const result = await repo.search('Test1Name');
            expect(result.length).toBe(1);
        });

        test('Then if the query is not valid, it should return an error', async () => {
            expect(async () => {
                await repo.search('Manuel');
            }).rejects.toThrowError();
        });
    });

    describe('When find its invoked', () => {
        test('Then it should return an item', async () => {
            const result = await repo.find({ name: 'Test1Name' });
            expect(result.name).toEqual(mockData[0].name);
        });
    });
});
