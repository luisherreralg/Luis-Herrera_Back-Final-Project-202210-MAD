import { NextFunction, Response } from 'express';
import mongoose from 'mongoose';
import { User } from '../entities/user';
import { ExtraRequest } from '../middlewares/interceptors';
import { OrderRepository } from '../repositories/order';
import { SneakerRepository } from '../repositories/sneaker';
import { UserRepository } from '../repositories/user';
import { createHttpError } from '../utils/create.http.error/create.http.error';
import { mockOrders, mockUsers } from '../utils/mocks/mocks';
import { OrderController } from './order.controller';

describe('Given the OrderController', () => {
    const mockData = mockOrders;

    const orderRepo = OrderRepository.getInstance();
    const sneakerRepo = SneakerRepository.getInstance();
    const userRepo = UserRepository.getInstance();
    const controller = new OrderController(orderRepo, sneakerRepo, userRepo);
    let req: Partial<ExtraRequest> = {};
    const resp: Partial<Response> = {};
    resp.status = jest.fn();
    resp.json = jest.fn();

    const next = jest.fn() as NextFunction;

    describe('When getCart its invoked', () => {
        orderRepo.find = jest.fn().mockResolvedValue(mockData[0]);

        test('If the user has a cart, it should return it', async () => {
            req.payload = {
                id: '6386300332f75d17ee9d62bb',
                name: 'Luis',
                role: 'user',
            };
            await controller.getCart(
                req as ExtraRequest,
                resp as Response,
                next
            );
            expect(resp.json).toHaveBeenCalledWith({ orders: mockData[0] });
        });

        test('If the user has not a cart, it should return an empty array', async () => {
            orderRepo.find = jest.fn().mockResolvedValue([]);
            await controller.getCart(
                req as ExtraRequest,
                resp as Response,
                next
            );
            expect(resp.json).toHaveBeenCalledWith({ orders: [] });
        });

        test('If req.payload is undefined it should throw an error', async () => {
            req = {};
            await controller.getCart(
                req as ExtraRequest,
                resp as Response,
                next
            );
            expect(next).toHaveBeenCalledWith(
                createHttpError(new Error('Invalid payload'))
            );
        });
    });

    describe('When newOrder is invoked', () => {
        const mockUser: User = {
            id: new mongoose.Types.ObjectId(),
            name: 'Test1Name',
            surname: 'Test1Surname',
            email: 'Test1Email',
            password:
                '$2a$10$h3j8SBMBoq0ANKCBu9jHYuKyVb3PvWrfd2igIf9mFc0QVp2/bi5xW', // Test1Password
            role: 'user',
        };
        orderRepo.find = jest.fn().mockResolvedValue(mockUser);
        orderRepo.post = jest.fn().mockResolvedValue(mockData[0]);

        test('If all the data its okey it should return a the new order', async () => {
            const spyUserRepo = jest
                .spyOn(userRepo, 'find')
                .mockResolvedValue(mockUser);

            req.payload = {
                id: '6386300332f75d17ee9d62bc',
                name: 'Luis',
                role: 'user',
            };
            req.params = {
                itemId: '6386300332f75d17ee9d62bb',
            };

            req.body = {
                cartedItem: '6386300332f75d17ee9d62bb',
                cartedBy: '6386300332f75d17ee9d62bb',
            };

            await controller.newOrder(
                req as ExtraRequest,
                resp as Response,
                next
            );
            expect(resp.json).toHaveBeenCalledWith({ orders: mockData[0] });
        });

        test('If there is not payload it should return an error', async () => {
            req = {};
            await controller.newOrder(
                req as ExtraRequest,
                resp as Response,
                next
            );
            expect(next).toHaveBeenCalledWith(
                createHttpError(new Error('Invalid payload'))
            );
        });

        test('If there is not req body it should return an error', async () => {
            req = {};
            await controller.newOrder(
                req as ExtraRequest,
                resp as Response,
                next
            );
            expect(next).toHaveBeenCalledWith(
                createHttpError(new Error('Invalid payload'))
            );
        });
    });

    describe('When updateOrder is invoked', () => {
        orderRepo.patch = jest.fn().mockResolvedValue(mockData[0]);
        orderRepo.find = jest.fn().mockResolvedValue(mockData[0]);

        test('If all the data its okey it should return a the new order', () => {
            req.payload = {
                id: '6386300332f75d17ee9d62bb',
                name: 'Luis',
                role: 'user',
            };
            req.params = {
                itemId: '6386300332f75d17ee9d62bb',
            };
            req.body = {
                cartedItem: '6386300332f75d17ee9d62bb',
                cartedBy: '6386300332f75d17ee9d62bb',
            };
            controller.updateOrder(req as ExtraRequest, resp as Response, next);
            expect(resp.json).toHaveBeenCalledWith({ orders: mockData[0] });
        });

        test('If there is not payload it should return an error', async () => {
            req = {};
            await controller.updateOrder(
                req as ExtraRequest,
                resp as Response,
                next
            );
            expect(next).toHaveBeenCalledWith(
                createHttpError(new Error('Invalid payload'))
            );
        });

        test('If there is not req body it should return an error', async () => {
            req = {};
            await controller.updateOrder(
                req as ExtraRequest,
                resp as Response,
                next
            );
            expect(next).toHaveBeenCalledWith(
                createHttpError(new Error('Invalid payload'))
            );
        });
    });

    describe('When deleteOrder is invoked', () => {
        orderRepo.delete = jest.fn().mockResolvedValue(mockData[0]);
        orderRepo.find = jest.fn().mockResolvedValue(mockData[0]);

        test('If all the data its okey it should return a the new order', () => {
            req.payload = {
                id: '6386300332f75d17ee9d62bb',
                name: 'Luis',
                role: 'user',
            };
            req.params = {
                itemId: '6386300332f75d17ee9d62bb',
            };
            controller.deleteOrder(req as ExtraRequest, resp as Response, next);
            expect(resp.json).toHaveBeenCalledWith({ orders: mockData[0] });
        });

        test('If there is not payload it should return an error', async () => {
            req = {};
            await controller.deleteOrder(
                req as ExtraRequest,
                resp as Response,
                next
            );
            expect(next).toHaveBeenCalledWith(
                createHttpError(new Error('Invalid payload'))
            );
        });
    });
});
