import { NextFunction, Request, Response } from 'express';
import { SneakerRepository } from '../repositories/sneaker';
import { SneakerController } from './sneaker.controller';

describe('Given the sneaker controller', () => {
    const repo = SneakerRepository.getInstance();
    repo.getAll = jest.fn().mockResolvedValue(['sneaker']);

    const sneakerController = new SneakerController(repo);
    const req: Partial<Request> = {};
    const resp: Partial<Response> = {
        status: jest.fn().mockReturnValue(201),
        json: jest.fn(),
    };
    const next: NextFunction = jest.fn();

    const mockResponse = { sneakers: ['sneaker'] };

    describe('When getAll is invoked', () => {
        test('Then it should return a json with the sneakers', async () => {
            await sneakerController.getAll(
                req as Request,
                resp as Response,
                next
            );
            expect(resp.status).toHaveBeenCalledWith(201);
            expect(resp.json).toHaveBeenCalledWith(mockResponse);
        });

        test('Then it should call next with an error if the repository throws an error', async () => {
            repo.getAll = jest.fn().mockRejectedValue(new Error('Error'));
            await sneakerController.getAll(
                req as Request,
                resp as Response,
                next
            );
            expect(next).toHaveBeenCalledWith(new Error('Error'));
        });
    });

    describe('When get is invoked', () => {
        test('Then it should return a json with the sneaker', async () => {
            repo.get = jest.fn().mockResolvedValue('sneaker');
            await sneakerController.get(req as Request, resp as Response, next);
            expect(resp.status).toHaveBeenCalledWith(201);
            expect(resp.json).toHaveBeenCalledWith({ sneakers: ['sneaker'] });
        });

        test('Then it should call next with an error if the repository throws an error', async () => {
            repo.get = jest.fn().mockRejectedValue(new Error('Error'));
            await sneakerController.get(req as Request, resp as Response, next);
            expect(next).toHaveBeenCalledWith(new Error('Error'));
            expect(resp.status).toHaveBeenCalledWith(201);
        });
    });

    describe('When search is invoked', () => {
        test('Then it should return a json with the sneakers', async () => {
            repo.search = jest.fn().mockResolvedValue(['sneaker']);
            await sneakerController.search(
                req as Request,
                resp as Response,
                next
            );
            expect(resp.status).toHaveBeenCalledWith(201);
            expect(resp.json).toHaveBeenCalledWith(mockResponse);
        });

        test('Then it should call next with an error if the repository throws an error', async () => {
            repo.search = jest.fn().mockRejectedValue(new Error('Error'));
            await sneakerController.search(
                req as Request,
                resp as Response,
                next
            );
            expect(next).toHaveBeenCalledWith(new Error('Error'));
        });
    });

    describe('When post is invoked', () => {
        test('Then it should return a json with the sneaker', async () => {
            repo.post = jest.fn().mockResolvedValue('sneaker');
            await sneakerController.post(
                req as Request,
                resp as Response,
                next
            );
            expect(resp.status).toHaveBeenCalledWith(201);
            expect(resp.json).toHaveBeenCalledWith({ sneakers: ['sneaker'] });
        });

        test('Then it should call next with an error if the repository throws an error', async () => {
            repo.post = jest.fn().mockRejectedValue(new Error('Error'));
            await sneakerController.post(
                req as Request,
                resp as Response,
                next
            );
            expect(next).toHaveBeenCalledWith(new Error('Error'));
        });
    });

    describe('When patch is invoked', () => {
        test('Then it should return a json with the sneaker', async () => {
            repo.patch = jest.fn().mockResolvedValue('sneaker');
            await sneakerController.patch(
                req as Request,
                resp as Response,
                next
            );
            expect(resp.status).toHaveBeenCalledWith(201);
            expect(resp.json).toHaveBeenCalledWith({ sneakers: ['sneaker'] });
        });

        test('Then it should call next with an error if the repository throws an error', async () => {
            repo.patch = jest.fn().mockRejectedValue(new Error('Error'));
            await sneakerController.patch(
                req as Request,
                resp as Response,
                next
            );
            expect(next).toHaveBeenCalledWith(new Error('Error'));
        });
    });

    describe('When delete is invoked', () => {
        test('Then it should return a json with the sneaker', async () => {
            repo.delete = jest.fn().mockResolvedValue('sneaker');
            await sneakerController.delete(
                req as Request,
                resp as Response,
                next
            );
            expect(resp.status).toHaveBeenCalledWith(201);
            expect(resp.json).toHaveBeenCalledWith({ sneakers: ['sneaker'] });
        });

        test('Then it should call next with an error if the repository throws an error', async () => {
            repo.delete = jest.fn().mockRejectedValue(new Error('Error'));
            await sneakerController.delete(
                req as Request,
                resp as Response,
                next
            );
            expect(next).toHaveBeenCalledWith(new Error('Error'));
        });
    });
});
