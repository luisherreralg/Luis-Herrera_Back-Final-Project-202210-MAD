import jwt from 'jsonwebtoken';
import bc from 'bcryptjs';
import { SECRET } from '../config';

export const getSecretWord = (secret = SECRET) => {
    if (typeof secret !== 'string' || secret === '') {
        throw new Error('Bad Secret for token creation');
    }
    return secret;
};

export type TokenPayload = {
    id: string;
    name: string;
    role: string;
};

export const generateToken = (payload: TokenPayload) => {
    return jwt.sign(payload, getSecretWord());
};

export const readToken = (token: string) => {
    const payload = jwt.verify(token, getSecretWord());
    return payload as jwt.JwtPayload;
};

export const encryptPassword = (passwd: string) => {
    return bc.hash(passwd, 10);
};

export const validatePassword = (newPasswd: string, hash: string) => {
    return bc.compare(newPasswd, hash);
};
