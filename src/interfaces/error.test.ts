import { CustomError, HTTPError } from './error';

describe('Given', () => {
    let error: CustomError;
    beforeEach(() => {
        error = new HTTPError(2, 'Test', 'Placeholder error message');
    });
    test('should first', () => {
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(HTTPError);
        expect(error).toHaveProperty('statusCode', 2);
        expect(error).toHaveProperty('statusMessage', 'Test');
        expect(error).toHaveProperty('message', 'Placeholder error message');
        expect(error).toHaveProperty('name', 'HTTPError');
    });
});
