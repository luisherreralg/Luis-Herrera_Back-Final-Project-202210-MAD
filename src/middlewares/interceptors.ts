import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { readToken } from '../services/auth.js';
import { createHttpError } from '../utils/create.http.error/create.http.error.js';
import createDebug from 'debug';
const debug = createDebug('SERVER:src:middlewares:interceptors');

export interface ExtraRequest extends Request {
    payload?: JwtPayload;
}

export const logged = (
    req: ExtraRequest,
    res: Response,
    next: NextFunction
) => {
    const authString = req.get('Authorization');

    if (!authString || !authString.startsWith('Bearer ')) {
        debug('Wrong credentials');
        next(createHttpError(new Error('Wrong credentials')));
        return;
    }

    try {
        const token = authString.slice(7);
        req.payload = readToken(token);
        debug('Logged');
        next();
    } catch (error) {
        next(createHttpError(error as Error));
    }
};

export const checkRole = async (
    req: ExtraRequest,
    res: Response,
    next: NextFunction
) => {
    debug('checkRole');
    try {
        if (!req.payload || req.payload.role !== 'admin') {
            throw new Error('Unauthorized');
        }
        next();
    } catch (error) {
        next(createHttpError(error as Error));
    }
};
