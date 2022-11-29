import { NextFunction, Request, Response } from 'express';
import { UserRepository } from '../repositories/user';
import { mockUsers } from '../utils/mocks/mocks';
import { UserController } from './user.controller';

const mockData = mockUsers;

describe('Given the user controller', () => {
    const repo = UserRepository.getInstance();
    repo.post = jest.fn().mockResolvedValue(mockData[0]);
    repo.find = jest.fn().mockResolvedValue(mockData[0]);

    const userController = new UserController(repo);
    let req: Partial<Request> = {
        body: mockData[0],
    };
    const resp: Partial<Response> = {
        status: jest.fn().mockReturnValue(201),
        json: jest.fn(),
    };
    const next: NextFunction = jest.fn();

    const mockResponse = { user: mockData[0] };

    describe('When register is invoked', () => {
        test('Then it should return a json with the user', async () => {
            req = {
                body: mockData[0],
            };

            const result = await userController.register(
                req as Request,
                resp as Response,
                next
            );

            console.log(
                '🚀 ~ file: user.controller.test.ts:36 ~ test ~ result',
                result
            );

            expect(resp.status).toHaveBeenCalledWith(201);
            expect(resp.json).toHaveBeenCalledWith(mockResponse);
        });

        test('Then it should call next with an error if the repository throws an error', async () => {
            repo.post = jest.fn().mockRejectedValue(new Error('Error'));
            await userController.register(
                req as Request,
                resp as Response,
                next
            );
            expect(next).toHaveBeenCalledWith(new Error('Error'));
        });
    });
});
