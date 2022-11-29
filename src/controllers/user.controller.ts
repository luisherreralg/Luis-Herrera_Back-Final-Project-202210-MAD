import { User } from '../entities/user.js';
import { UserRepo } from '../repositories/repo.js';
import createDebug from 'debug';
import { HTTPError } from '../interfaces/error.js';
import { NextFunction, Request, Response } from 'express';
import { generateToken, validatePassword } from '../services/auth.js';

const debug = createDebug('SERVER:src:controllers:userController');

export class UserController {
    constructor(public readonly repository: UserRepo<User>) {
        debug('UserController instance created');
    }

    async register(req: Request, resp: Response, next: NextFunction) {
        try {
            debug('register controller using repository register');
            const user = await this.repository.post(req.body);
            resp.status(201).json({ user });
        } catch (error) {
            next(this.#createHttpError(error as Error));
        }
    }

    async login(req: Request, resp: Response, next: NextFunction) {
        try {
            debug('login', req.body.email);

            const user = await this.repository.find({
                email: req.body.email,
            } as User);
            user.id;

            const isPasswdValid = await validatePassword(
                req.body.password,

                user.password
            );

            if (!isPasswdValid) throw new Error();
            const token = generateToken({
                id: user.id.toString(),
                name: user.name,
                role: user.role,
            });
            resp.json({ token });
        } catch (error) {
            next(this.#createHttpError(error as Error));
        }
    }

    #createHttpError(error: Error) {
        if ((error as Error).message === 'Not found id') {
            const httpError = new HTTPError(
                404,
                'Not Found',
                (error as Error).message
            );
            return httpError;
        }
        const httpError = new HTTPError(
            503,
            'Service unavailable',
            (error as Error).message
        );
        return httpError;
    }
}
