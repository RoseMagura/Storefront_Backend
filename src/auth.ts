import * as jwt from 'jsonwebtoken';
import { HttpCode } from './interfaces/HttpCode';

export const checkToken = (token: string): HttpCode => {
    if (token === undefined) {
        return { 'code': 401, 'message': 'This endpoint requires JWT. Please login' };
    } else {
        try {
            jwt.verify(token, String(process.env.JWTKEY));
        } catch (error: unknown) {
            console.log('error', error);
            if (error instanceof jwt.JsonWebTokenError) {
                return { 'code': 401,'message': 'Token is unauthorized' };
            } else {
                return { 'code': 400, 'message': 'Error with request' };
            }
        }
        return { 'code': 200, 'message': 'Success' };
    }
};
