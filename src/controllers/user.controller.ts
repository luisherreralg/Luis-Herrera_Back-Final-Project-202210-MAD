import { User } from '../entities/user.js';
import { UserRepo } from '../repositories/repo.js';
import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { generateToken, validatePassword } from '../services/auth.js';
import { createHttpError } from '../utils/create.http.error/create.http.error.js';

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
            next(createHttpError(error as Error));
        }
    }

    async login(req: Request, resp: Response, next: NextFunction) {
        try {
            debug('login', req.body.email);

            const user = await this.repository.find({
                email: req.body.email,
            } as User);

            const isPasswdValid = await validatePassword(
                req.body.password,
                user.password
            );

            if (!isPasswdValid) {
                throw new Error('Wrong credentials');
            }

            const token = generateToken({
                id: user.id.toString(),

                name: user.name,
                role: user.role,
            });

            resp.status(201);
            resp.json({ token });
        } catch (error) {
            next(createHttpError(error as Error));
        }
    }
}
