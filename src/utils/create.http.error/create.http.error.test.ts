import { createHttpError } from './create.http.error';

describe('Given the createHttpError function', () => {
    describe('When its invoked', () => {
        test('Then when the error passed to the function has a "Not found id" message it should return an http error with a statusMessage = "Not Found"', () => {
            const mockError = new Error('Not found id');
            const result = createHttpError(mockError);
            expect(result.statusMessage.toString()).toEqual('Not found');
        });

        test('Then when the error passed to the function has a "Unauthorized" message it should return an http error with a statusMessage = "Unauthorized"', () => {
            const mockError = new Error('Unauthorized');
            const result = createHttpError(mockError);
            expect(result.statusMessage.toString()).toEqual('Unauthorized');
        });

        test('Then when the error passed to the function has a standard message it should return an http error with a statusMessage = "Service unavailable"', () => {
            const mockError = new Error('Error');
            const result = createHttpError(mockError);
            expect(result.statusMessage.toString()).toEqual(
                'Service unavailable'
            );
        });
    });
});
