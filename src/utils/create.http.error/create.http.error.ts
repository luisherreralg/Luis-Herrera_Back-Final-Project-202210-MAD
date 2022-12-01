import { HTTPError } from '../../interfaces/error.js';

export const createHttpError = (error: Error) => {
    if ((error as Error).message === 'Not found id') {
        const httpError = new HTTPError(
            404,
            'Not found',
            (error as Error).message
        );
        return httpError;
    }

    if ((error as Error).message === 'Unauthorized') {
        const httpError = new HTTPError(
            401,
            'Unauthorized',
            (error as Error).message
        );
        return httpError;
    }

    if ((error as Error).message === 'No matched results') {
        const httpError = new HTTPError(
            404,
            'Not found',
            (error as Error).message
        );
        return httpError;
    }

    if ((error as Error).message === 'Empty collection') {
        const httpError = new HTTPError(
            404,
            'Not found',
            (error as Error).message
        );
        return httpError;
    }

    if ((error as Error).message === 'No data provided') {
        const httpError = new HTTPError(
            406,
            'Not acceptable',
            (error as Error).message
        );
        return httpError;
    }

    if ((error as Error).message === 'Wrong credentials') {
        const httpError = new HTTPError(
            406,
            'Not acceptable',
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
};
