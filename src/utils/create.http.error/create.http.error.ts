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
    const httpError = new HTTPError(
        503,
        'Service unavailable',
        (error as Error).message
    );
    return httpError;
};
