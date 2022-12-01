import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { Sneaker } from '../entities/sneaker.js';
import { HTTPError } from '../interfaces/error.js';
import { Repo } from '../repositories/repo.js';
import { createHttpError } from '../utils/create.http.error/create.http.error.js';

const debug = createDebug('SERVER:src:controllers:sneaker');

export class SneakerController {
    constructor(public readonly repository: Repo<Sneaker>) {
        debug('SneakerController instance created');
    }

    async getAll(req: Request, resp: Response, next: NextFunction) {
        try {
            debug('GetAll controller using repository getAll');
            const sneakers = await this.repository.getAll();

            resp.status(201);
            resp.json({ sneakers });
        } catch (error) {
            next(createHttpError(error as Error));
        }
    }

    async get(req: Request, resp: Response, next: NextFunction) {
        try {
            debug('get controller using repository get');
            const sneaker = await this.repository.get(req.params.id);
            resp.status(201);
            resp.json({ sneaker });
        } catch (error) {
            next(createHttpError(error as Error));
        }
    }

    async search(req: Request, resp: Response, next: NextFunction) {
        try {
            debug(
                'search controller using repository search',
                'query ->',
                req.params.query
            );

            const sneakers = await this.repository.search(req.params.query);
            resp.status(201);
            resp.json({ sneakers });
        } catch (error) {
            next(createHttpError(error as Error));
        }
    }

    async post(req: Request, resp: Response, next: NextFunction) {
        try {
            debug('post controller using repository post');
            const sneaker = await this.repository.post(req.body);
            resp.status(201);
            resp.json({ sneaker });
        } catch (error) {
            next(createHttpError(error as Error));
        }
    }

    async patch(req: Request, resp: Response, next: NextFunction) {
        try {
            debug('patch controller using repository patch');
            const sneaker = await this.repository.patch(
                req.params.id,
                req.body
            );
            resp.status(201).json({ sneaker });
        } catch (error) {
            next(createHttpError(error as Error));
        }
    }

    async delete(req: Request, resp: Response, next: NextFunction) {
        try {
            debug('delete controller using repository delete');
            await this.repository.delete(req.params.id);
            resp.status(201);
            resp.json({});
        } catch (error) {
            next(createHttpError(error as Error));
        }
    }
}
