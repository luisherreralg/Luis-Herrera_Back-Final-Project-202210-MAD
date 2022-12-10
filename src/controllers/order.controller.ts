import createDebug from 'debug';
import { NextFunction, Response } from 'express';
import mongoose from 'mongoose';
import { Order } from '../entities/order.js';
import { Sneaker } from '../entities/sneaker.js';
import { User } from '../entities/user.js';
import { ExtraRequest } from '../middlewares/interceptors.js';
import { OrderRepo, Repo, UserRepo } from '../repositories/repo.js';
import { createHttpError } from '../utils/create.http.error/create.http.error.js';

const debug = createDebug('SERVER:src:controllers:orderController');

export class OrderController {
    constructor(
        public readonly repository: OrderRepo<Order>,
        public readonly sneakerRepo: Repo<Sneaker>,
        public readonly userRepo: UserRepo<User>
    ) {
        debug('OrderController instance created');
    }

    async getCart(req: ExtraRequest, resp: Response, next: NextFunction) {
        try {
            debug('getCart controller');

            // Check here if the logger middleware pass to this method the user id
            if (!req.payload) {
                throw new Error('Invalid payload');
            }

            const orders = await this.repository.find({
                cartedBy: new mongoose.Types.ObjectId(req.payload.id),
            });

            resp.status(201);
            resp.json({ orders });
        } catch (error) {
            next(createHttpError(error as Error));
        }
    }

    async newOrder(req: ExtraRequest, resp: Response, next: NextFunction) {
        try {
            debug('newOrder controller');

            // I check here if the logger middleware pass to this method the user id
            if (!req.payload || req.payload === undefined) {
                throw new Error('Invalid payload');
            }

            // debug('newOrder controller - req.payload', req.payload);
            // // Find the user passed by the logger
            // const user = await this.userRepo.find({ id: req.payload.id });
            // debug('newOrder controller - user', user);
            // // Save the userId and the itemId inside the req.body
            req.body.cartedBy = req.payload.id;
            req.body.cartedItem = req.params.itemId;

            // Post the new order with the two ids
            const order = await this.repository.post(req.body);

            resp.status(201);
            resp.json({ order });
        } catch (error) {
            next(createHttpError(error as Error));
        }
    }

    async updateOrder(req: ExtraRequest, resp: Response, next: NextFunction) {
        try {
            debug('updateOrder controller');

            if (!req.payload || req.payload === undefined) {
                throw new Error('Invalid payload');
            }

            const order = await this.repository.patch(
                req.payload.id,
                req.params.itemId,
                req.body
            );

            resp.status(201);
            resp.json({ order });
        } catch (error) {
            next(createHttpError(error as Error));
        }
    }

    async deleteOrder(req: ExtraRequest, resp: Response, next: NextFunction) {
        try {
            debug('deleteOrder controller');

            if (!req.payload || req.payload === undefined) {
                throw new Error('Invalid payload');
            }

            const order = await this.repository.delete(
                req.payload.id,
                req.params.itemId
            );

            resp.status(201);
            resp.json({ order });
        } catch (error) {
            next(createHttpError(error as Error));
        }
    }
}
