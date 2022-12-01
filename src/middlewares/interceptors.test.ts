import { NextFunction, Request, Response } from 'express';
import { createHttpError } from '../utils/create.http.error/create.http.error';
import { checkRole, ExtraRequest, logged } from './interceptors';

describe('Given the logged interceptor', () => {
    describe('When its invoked', () => {
        test('When the authString is empty, it should return an error', () => {
            const req: Partial<Request> = {
                get: jest.fn().mockReturnValueOnce(false),
            };
            const res: Partial<Response> = {};
            const next: NextFunction = jest.fn();

            logged(req as Request, res as Response, next);
            expect(next).toHaveBeenCalledWith(
                createHttpError(new Error('Wrong credentials'))
            );
        });
    });

    test('Then if the readToken function reads the token and its not valid, then it should return an error', () => {
        const req: Partial<Request> = {
            get: jest.fn().mockReturnValueOnce('Bearer 1234'),
        };
        const res: Partial<Response> = {};
        const next: NextFunction = jest.fn();

        logged(req as Request, res as Response, next);
        expect(next).toHaveBeenCalledWith(
            createHttpError(new Error('jwt malformed'))
        );
    });

    test('Then if the readToken inside the logged interceptor function reads a correct token, it should return the payload', () => {
        const req: Partial<ExtraRequest> = {
            get: jest
                .fn()
                .mockReturnValueOnce(
                    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzODYzMDAzMzJmNzVkMTdlZTlkNjJiYiIsIm5hbWUiOiJMdWlzIiwicm9sZSI6InVzZXIiLCJpYXQiOjE2Njk3OTc3NzF9.etU9QAFmgFNvTr-eb3e3xAopVftl2_ZZOk1B01oUiGQ'
                ),
        };
        const res: Partial<Response> = {};
        const next: NextFunction = jest.fn();

        logged(req as ExtraRequest, res as Response, next);
        expect(next).toHaveBeenCalled();

        expect(req.payload).toStrictEqual({
            id: expect.any(String),
            iat: expect.any(Number),
            name: 'Luis',
            role: 'user',
        });
    });
});

describe('Given the checkRole interceptor', () => {
    describe('When its invoked', () => {
        test('Then it should throw an error if the req.payload.role is not "admin"', () => {
            const req: Partial<ExtraRequest> = {
                payload: {
                    role: 'user',
                },
            };
            const res: Partial<Response> = {};
            const next: NextFunction = jest.fn();

            checkRole(req as ExtraRequest, res as Response, next);
            expect(next).toHaveBeenCalledWith(
                createHttpError(new Error('Unauthorized'))
            );
        });

        test('Then if the role is admin it should pass the next function with the correct data', () => {
            const req: Partial<ExtraRequest> = {
                payload: {
                    role: 'admin',
                },
            };
            const res: Partial<Response> = {};
            const next: NextFunction = jest.fn();

            checkRole(req as ExtraRequest, res as Response, next);
            expect(next).toHaveBeenCalled();
        });
    });
});
