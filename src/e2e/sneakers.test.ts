import { Types } from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import { ProtoSneaker, SneakerModel } from '../entities/sneaker';
import { generateToken } from '../services/auth';
import { DbConnections } from '../utils/db/db.connections';
import {
    mockSneakers,
    payloadMock,
    setUpSneakerCollection,
} from '../utils/mocks/mocks';

describe('Given the "app" with the "/sneakers" route', () => {
    let token: string;
    let sneakerIds: string[];
    const connections = DbConnections.getInstance();

    const notAdminUser = {
        id: new Types.ObjectId().toString(),
        name: 'TestName',
        role: 'user',
    };

    beforeAll(async () => {
        await connections.dbConnect();
    });

    beforeEach(async () => {
        sneakerIds = await setUpSneakerCollection();
        token = generateToken(payloadMock(sneakerIds[0]));
    });

    afterAll(async () => {
        await connections.dbDisconnect();
    });

    describe('When we do a get using a getAll method  form the SneakersController', () => {
        test('Then if its all okey it should return a response status = 201', async () => {
            await request(app).get('/sneakers').expect(201);
        });

        test('Then if the connection to Mongo its closed it should return a status = 503', async () => {
            await connections.dbDisconnect();
            await request(app).get('/sneakers').expect(503);
        });

        test('Then if the mongo collection its empty it should return a status = 404', async () => {
            await SneakerModel.deleteMany();
            await request(app).get('/sneakers').expect(404);
        });
    });

    describe('When we do a get using a get method form the SneakersController', () => {
        test('Then if its all okey it should return a response status = 201', async () => {
            await request(app).get(`/sneakers/${sneakerIds[0]}`).expect(201);
        });

        test('Then if  the connection to Mongo its closed it should return a status = 503', async () => {
            await connections.dbDisconnect();
            await request(app).get(`/sneakers/${sneakerIds[0]}`).expect(503);
        });

        test('Then if the mongo collection its empty it should return a status = 404', async () => {
            await SneakerModel.deleteMany();
            await request(app).get(`/sneakers/${sneakerIds[0]}`).expect(404);
        });
    });

    describe('When we do a get using the search method form the SneakersController', () => {
        test('Then if its all okey it should return a response status = 201', async () => {
            await request(app)
                .get(`/sneakers/search/${mockSneakers[0].brand}`)
                .expect(201);
        });

        test('Then if the connection to Mongo its closed it should return a status = 503', async () => {
            await connections.dbDisconnect();
            await request(app)
                .get(`/sneakers/search/${mockSneakers[0].brand}`)
                .expect(503);
        });

        test('Then if there is not matched results it should return a status = 404', async () => {
            await request(app).get(`/sneakers/search/${'WRONG'}`).expect(404);
        });
    });

    describe('When we do a post using the post method form the "SneakerController"', () => {
        const newSneaker: ProtoSneaker = {
            brand: 'TestBrand',
            model: 'TestModel',
            size: ['40'],
            price: 0,
            onSalePrice: 0,
            onSale: false,
            stock: 0,
            gender: 'male',
        };

        test('Then if its all okey it should return a response status = 201', async () => {
            await request(app)
                .post('/sneakers')
                .set('Authorization', `Bearer ${token}`)
                .send(newSneaker)
                .expect(201);
        });

        test('Then if  the connection to Mongo its closed it should return a status = 503', async () => {
            await connections.dbDisconnect();
            await request(app)
                .post('/sneakers')
                .set('Authorization', `Bearer ${token}`)
                .send(newSneaker)
                .expect(503);
        });

        test('Then if whe do a post without sent info it should return a status = 406', async () => {
            await request(app)
                .post('/sneakers')
                .set('Authorization', `Bearer ${token}`)
                .expect(406);
        });

        test('Then if the user does not have the role = "admin" it should return a status = 401', async () => {
            const notAdminToken = await generateToken(notAdminUser);
            await request(app)
                .post('/sneakers')
                .set('Authorization', `Bearer ${notAdminToken}`)
                .send(newSneaker)
                .expect(401);
        });
    });

    describe('When we do a patch using the patch method from the "SneakerController"', () => {
        const updatedSneaker: ProtoSneaker = {
            brand: 'TestBrand',
            model: 'TestModel',
            size: ['40'],
            price: 0,
            onSalePrice: 0,
            onSale: false,
            stock: 0,
            gender: 'male',
        };
        test('Then if its all okey it should return a response status = 201', async () => {
            await request(app)
                .patch(`/sneakers/${sneakerIds[0]}`)
                .set('Authorization', `Bearer ${token}`)
                .send(updatedSneaker)
                .expect(201);
        });

        test('Then if the connection to Mongo its closed it should return a status = 503', async () => {
            await connections.dbDisconnect();
            await request(app)
                .patch(`/sneakers/${sneakerIds[0]}`)
                .set('Authorization', `Bearer ${token}`)
                .send(updatedSneaker)
                .expect(503);
        });

        test('Then if there is no data send to update it should return a status = 406', async () => {
            await request(app)
                .patch(`/sneakers/${sneakerIds[0]}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(406);
        });

        test('If the query id is not valid, it should return a status = 404', async () => {
            await request(app)
                .patch(`/sneakers/123141`)
                .set('Authorization', `Bearer ${token}`)
                .expect(406);
        });

        test('Then if the user does not have the role = "admin" it should return a status = 401', async () => {
            const notAdminToken = await generateToken(notAdminUser);
            await request(app)
                .patch(`/sneakers/${sneakerIds[0]}`)
                .set('Authorization', `Bearer ${notAdminToken}`)
                .send(updatedSneaker)
                .expect(401);
        });
    });
    describe('When we do a delete using the delete method from the "SneakerController"', () => {
        test('Then if its all okey it should return a response status = 201', async () => {
            await request(app)
                .delete(`/sneakers/${sneakerIds[0]}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(201);
        });

        test('When the connection to Mongo its closed it should return a status = 503', async () => {
            await connections.dbDisconnect();
            await request(app)
                .delete(`/sneakers/${sneakerIds[0]}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(503);
        });

        test('Then if the user does not have the role = "admin" it should return a status = 401', async () => {
            const notAdminToken = await generateToken(notAdminUser);
            await request(app)
                .delete(`/sneakers/${sneakerIds[0]}`)
                .set('Authorization', `Bearer ${notAdminToken}`)
                .expect(401);
        });
    });
});
