import jwt from 'jsonwebtoken';
import bc from 'bcryptjs';
import { SECRET } from '../config.js';
import {
    encryptPassword,
    generateToken,
    getSecretWord,
    readToken,
    validatePassword,
} from './auth.js';

const mock = {
    id: '1',
    name: 'Petter',
    role: '',
};

describe('Given getSecretWord service', () => {
    describe('When the secret word is not a string', () => {
        test('Then an error should be throw', () => {
            expect(() => {
                getSecretWord('');
            }).toThrowError();
        });
    });
});

describe('Given  generateToken service', () => {
    describe('When the function its invoked', () => {
        test('Then it should return a token', () => {
            const signSpy = jest.spyOn(jwt, 'sign');
            const result = generateToken(mock);
            expect(typeof result).toBe('string');
            expect(signSpy).toHaveBeenCalledWith(mock, SECRET);
        });
    });
});

describe('Given readToken service', () => {
    describe('When  the token is valid', () => {
        const validToken = generateToken(mock);
        test('Then it should return the token coded info', () => {
            const result = readToken(validToken);
            expect(result.name).toEqual(mock.name);
        });
    });

    describe('When there are no token', () => {
        const invalidToken = '';
        test('It should throw an error', () => {
            expect(() => {
                readToken(invalidToken);
            }).toThrowError('jwt must be provided');
        });
    });

    describe('When token is NOT valid', () => {
        const invalidToken =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IlBlcGUiLCJpYXQiOjE2Njg3NzMwNTB9.DGdcCXGRUS4SaCMyY5RSy-8v9tylvmV_HE1rQJGYJ_55';
        test('It should throw an error', () => {
            expect(() => {
                readToken(invalidToken);
            }).toThrowError('invalid signature');
        });
    });

    describe('When token is bad formatted', () => {
        const invalidToken = 'soy un token';
        test('It should throw an error', () => {
            expect(() => {
                readToken(invalidToken);
            }).toThrowError('jwt malformed');
        });
    });
});

describe('Given "encryptPassword" & passwdValidate', () => {
    const spyBcHash = jest.spyOn(bc, 'hash');
    const spyBcCompare = jest.spyOn(bc, 'compare');
    describe('When we call passwdEncrypt', () => {
        test('Bcrypt.hash should be call', async () => {
            await encryptPassword('12345');
            expect(spyBcHash).toHaveBeenCalled();
        });
    });

    describe(`Whe we call validatePassword also
                and The passwd and its encryption are compared`, () => {
        let hash: string;
        const passwd = '12345';
        const badPasswd = '00000';

        beforeEach(async () => {
            hash = await encryptPassword(passwd);
        });

        test('Then a valid password should be detected', async () => {
            const result = await validatePassword(passwd, hash);
            expect(spyBcCompare).toHaveBeenCalled();
            expect(result).toBe(true);
        });
        test('Then a valid password should be detected', async () => {
            const result = await validatePassword(badPasswd, hash);
            expect(spyBcCompare).toHaveBeenCalled();
            expect(result).toBe(false);
        });
    });
});
