import { Types } from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import { OrderModel } from '../entities/order';
import { generateToken } from '../services/auth';
import { DbConnections } from '../utils/db/db.connections';
import { payloadMock, setUpOrderCollection } from '../utils/mocks/mocks';

describe('Given the app with the "/orders" route', () => {
    let token: string;
    let sneakerIds: string[];
    let usersIds: string[];
    let allIds: {
        orderIds: Types.ObjectId[];
        userIds: Types.ObjectId[];
        sneakerIds: Types.ObjectId[];
    };

    const connections = DbConnections.getInstance();

    beforeAll(async () => {
        await connections.dbConnect();
    });

    beforeEach(async () => {
        allIds = await setUpOrderCollection();
        sneakerIds = allIds.sneakerIds.map((id) => id.toString());
        usersIds = allIds.userIds.map((id) => id.toString());
        token = generateToken(payloadMock(usersIds[0]));
    });

    afterAll(async () => {
        await connections.dbDisconnect();
    });

    describe('When we do a get using the getCart method from the "OrdersController"', () => {
        test('If all is okey it should return a status 201', async () => {
            await request(app)
                .get(`/orders/cart`)
                .set('Authorization', `Bearer ${token}`)
                .expect(201);
        });

        test('If there is a wrong payload inside the token, it must return a status = 406', async () => {
            await request(app)
                .get(`/orders/cart`)
                .set('Authorization', `wrong`)
                .expect(406);
        });

        test('If there is not any authorization, it must return a status = 406', async () => {
            await request(app).get(`/orders/cart`).expect(406);
        });
    });

    describe('When we do a post using the newOrder method from the "OrdersController"', () => {
        test('If all is okey it must return a status = 201 ', async () => {
            await request(app)
                .post(`/orders/newOrder/${sneakerIds[0]}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(201);
        });

        test('If there is a wrong payload inside the token, it must return a status = 406', async () => {
            await request(app)
                .post(`/orders/newOrder/${sneakerIds[0]}`)
                .set('Authorization', `wrong`)
                .expect(406);
        });

        test('If there is not any authorization, it must return a status = 406', async () => {
            await request(app)
                .post(`/orders/newOrder/${sneakerIds[0]}`)
                .expect(406);
        });

        test('If there is not a sneaker id in the query it should return a status = 404', async () => {
            await request(app)
                .post(`/orders/newOrder`)
                .set('Authorization', `Bearer ${token}`)
                .expect(404);
        });
    });

    describe('When we do a delete using the deleteOrder method from the "OrdersController"', () => {
        test('If it is all okey it should return a state  = 201', async () => {
            await request(app)
                .delete(`/orders/delete/${sneakerIds[0]}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(201);
        });

        test('If there is no info on the query it must return a status = 404', async () => {
            await request(app)
                .delete(`/orders/delete`)
                .set('Authorization', `Bearer ${token}`)
                .expect(404);
        });

        test('If there is no auth it must return a status = 406', async () => {
            await request(app)
                .delete(`/orders/delete/${sneakerIds[0]}`)
                .expect(406);
        });

        test('If there is no orders associated to the user it must return a status = 406', async () => {
            await OrderModel.deleteMany();

            await request(app)
                .delete(`/orders/delete/${sneakerIds[0]}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(404);
        });

        test('If there is no products associated to the user it must return a status = 406', async () => {
            await OrderModel.deleteMany();
            await OrderModel.insertMany({
                size: '50',
                cartedItem: new Types.ObjectId(),
                cartedBy: usersIds[0],
            });

            await request(app)
                .delete(`/orders/delete/${sneakerIds[0]}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(503);
        });
    });
});
