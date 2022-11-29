import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { User } from '../entities/user';
import { HTTPError } from '../interfaces/error';
import { UserRepository } from '../repositories/user';
import { mockUsers } from '../utils/mocks/mocks';
import { UserController } from './user.controller';

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

        test('If all the req data its okey, it should login a user', async () => {
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

        test('If the req password is invalid it should throw an error', () => {
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
    });
});

// TODO: pending to delete this commented code
// const mockData = mockUsers;

// describe('Given the user controller', () => {
//     const repo = UserRepository.getInstance();
//     repo.post = jest.fn().mockResolvedValue(mockData[0]);
//     repo.find = jest.fn().mockResolvedValue(mockData[0]);

//     const userController = new UserController(repo);
//     let req: Partial<Request> = {
//         body: mockData[0],
//     };
//     const resp: Partial<Response> = {
//         status: jest.fn().mockReturnValue(201),
//         json: jest.fn(),
//     };
//     const next: NextFunction = jest.fn();

//     const mockResponse = { user: mockData[0] };

//     describe('When register is invoked', () => {
//         test('Then it should return a json with the user', async () => {
//             req = {
//                 body: mockData[0],
//             };

//             const result = await userController.register(
//                 req as Request,
//                 resp as Response,
//                 next
//             );

//             expect(resp.status).toHaveBeenCalledWith(201);
//             expect(resp.json).toHaveBeenCalledWith(mockResponse);
//         });

//         test('Then it should call next with an error if the repository throws an error', async () => {
//             repo.post = jest.fn().mockRejectedValue(new Error('Error'));
//             await userController.register(
//                 req as Request,
//                 resp as Response,
//                 next
//             );
//             expect(next).toHaveBeenCalledWith(new Error('Error'));
//         });
//     });
// });
