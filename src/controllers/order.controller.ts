import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { Sneaker } from '../entities/sneaker.js';
import { User } from '../entities/user.js';
import { ExtraRequest } from '../middlewares/interceptors.js';
import { Repo, UserRepo } from '../repositories/repo.js';
import { createHttpError } from '../utils/create.http.error/create.http.error.js';

const debug = createDebug('SERVER:src:controllers:orderController');

export class OrderController {
    constructor(
        // TODO: Use the generic type to avoid the any type
        public readonly repository: any,
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

            resp.json({ orders });
        } catch (error) {
            next(createHttpError(error as Error));
        }
    }

    async newOrder(req: ExtraRequest, resp: Response, next: NextFunction) {
        try {
            debug('newOrder controller');

            // Check here if the logger middleware pass to this method the user id
            if (!req.payload || req.payload === undefined) {
                throw new Error('Invalid payload');
            }

            // Find the user passed by the logger
            const user = await this.userRepo.find({ id: req.payload.id });

            // Save the userId and the itemId inside the req.body
            req.body.cartedBy = user.id;
            req.body.cartedItem = req.params.itemId;

            // Post the new order with the two ids
            const order = await this.repository.post(req.body);

            resp.json({ order });
        } catch (error) {
            next(createHttpError(error as Error));
        }
    }

    async deleteOrder(req: Request, resp: Response, next: NextFunction) {
        try {
            debug('deleteOrder controller');

            const order = await this.repository.delete(
                req.params.userId,
                req.params.itemId
            );

            resp.json({ order });
        } catch (error) {
            next(createHttpError(error as Error));
        }
    }
}
