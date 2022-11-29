import { NextFunction, Request, Response } from 'express';
import { SneakerRepository } from '../repositories/sneaker';
import { SneakerController } from './sneaker.controller';

describe('Given the sneaker controller', () => {
    const repo = SneakerRepository.getInstance();
    repo.getAll = jest.fn().mockResolvedValue(['sneaker']);

    const sneakerController = new SneakerController(repo);
    const req: Partial<Request> = {};
    const resp: Partial<Response> = {
        json: jest.fn(),
    };
    const next: NextFunction = jest.fn();
    const mockResponse = { sneakers: ['sneaker'] };

    test('Then getAll should return an array of sneakers', async () => {
        await sneakerController.getAll(req as Request, resp as Response, next);
        expect(resp.json).toHaveBeenCalledWith(mockResponse);
    });
});
