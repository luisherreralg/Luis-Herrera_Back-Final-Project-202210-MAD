import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { User } from '../entities/user';
import { HTTPError } from '../interfaces/error';
import { UserRepository } from '../repositories/user';
import { generateToken, validatePassword } from '../services/auth';
import { mockUsers } from '../utils/mocks/mocks';
import { UserController } from './user.controller';

jest.mock('../services/auth');

describe('Given the user controller', () => {
    const mockData = mockUsers;

    const repo = UserRepository.getInstance();
    const controller = new UserController(repo);
    const req: Partial<Request> = {};
    const resp: Partial<Response> = {};
    resp.status = jest.fn().mockReturnValue(resp);
    resp.json = jest.fn();

    const next = jest.fn() as NextFunction;

    describe('When register its invoked', () => {
        repo.post = jest.fn().mockResolvedValue({
            ...(mockData[0] as User),
            id: new mongoose.Types.ObjectId(),
        });

        test('If all the req data its okey, it should register a new user', async () => {
            await controller.register(req as Request, resp as Response, next);
            expect(resp.json).toHaveBeenCalledWith({
                user: {
                    // expect.any is used to check if the id is a mongoose.Types.ObjectId
                    id: expect.any(mongoose.Types.ObjectId),
                    name: mockData[0].name,
                    surname: mockData[0].surname,
                    email: mockData[0].email,
                    password: mockData[0].password,
                    role: mockData[0].role,
                },
            });
        });

        test('If the req data its not okey, it should throw an error', async () => {
            repo.post = jest.fn().mockRejectedValue(new Error('Error'));
            await controller.register(req as Request, resp as Response, next);
            expect(next).toHaveBeenCalledWith(new Error('Error'));
        });
    });

    describe('When login its invoked', () => {
        repo.find = jest.fn().mockResolvedValue({
            ...(mockData[0] as User),
            id: new mongoose.Types.ObjectId(),
        });

        req.body = {
            email: mockData[0].email,
            password: mockData[0].password,
        };

        test('If all the req data its okey, it should login a user', async () => {
            (validatePassword as jest.Mock).mockResolvedValue(true);
            await controller.login(req as Request, resp as Response, next);
            expect(resp.json).toHaveBeenCalledWith({
                user: {
                    id: expect.any(mongoose.Types.ObjectId),
                    name: mockData[0].name,
                    surname: mockData[0].surname,
                    email: mockData[0].email,
                    password: mockData[0].password,
                    role: mockData[0].role,
                },
            });
        });

        test('If the req data its not okey, it should throw an error', async () => {
            repo.find = jest.fn().mockRejectedValue(new Error('Error'));
            await controller.login(req as Request, resp as Response, next);
            expect(next).toHaveBeenCalledWith(new Error('Error'));
        });

        test('If the req password is malformed it should throw an error', () => {
            repo.find = jest.fn().mockResolvedValue({
                ...(mockData[0] as User),
                id: new mongoose.Types.ObjectId(),
                password: 10,
            });
            controller.login(req as Request, resp as Response, next);
            expect(next).toHaveBeenCalledWith(
                new HTTPError(401, 'Error', 'Error')
            );
        });

        test('If the req password is not valid it should throw an error', async () => {
            (validatePassword as jest.Mock).mockResolvedValue(false);
            await controller.login(req as Request, resp as Response, next);
            expect(next).toHaveBeenCalledWith(
                new HTTPError(401, 'Error', 'Error')
            );
        });
    });
});
