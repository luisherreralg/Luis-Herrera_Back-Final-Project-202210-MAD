import { ProtoUser } from '../entities/user';
import { DbConnections } from '../utils/db/db.connections';
import { mockUsers, setUpUserCollection } from '../utils/mocks/mocks';
import request from 'supertest';
import { app } from '../app';

describe('Given the "app" with the "/users" route', () => {
    let token: string;
    let userIds: string[];
    const connections = DbConnections.getInstance();

    beforeAll(async () => {
        await connections.dbConnect();
    });

    beforeEach(async () => {
        userIds = await setUpUserCollection();
    });

    afterAll(async () => {
        await connections.dbDisconnect();
    });

    describe('When we do a post using a register method  form the "UserController"', () => {
        const newUser: ProtoUser = {
            name: 'newUser',
            surname: 'newSurname',
            email: 'newEmail',
            password: 'newPassword',
            role: 'user',
        };

        test('Then if is all okey it should return a status = 201', async () => {
            await request(app)
                .post('/users/register')
                .send(newUser)
                .expect(201);
        });

        test('Then if there is not data provided when doing a register, it should return a status = 406', async () => {
            await request(app).post('/users/register').expect(406);
        });
    });

    describe('When we do a post using a login method  form the "UserController"', () => {
        const loginData = {
            email: mockUsers[0].email,
            password: 'Test1Password',
        };

        test('Then if is all okey it should return a status = 201', async () => {
            await request(app).post('/users/login').send(loginData).expect(201);
        });

        test('If the password is wrong it should return a status = 406', async () => {
            loginData.password = 'wrongPassword';
            await await request(app)
                .post('/users/login')
                .send(loginData)
                .expect(406);
        });

        test('If the email is not correct it should return a status = 503', async () => {
            loginData.email = 'email.algo';
            await request(app).post('/users/login').send(loginData).expect(503);
        });
    });
});
