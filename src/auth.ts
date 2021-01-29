import * as jwt from 'jsonwebtoken';

export const checkToken = (token: string): object => {
    if(token === undefined){
        return {401: 'This endpoint requires JWT. Please login'};
    } else {
        try {
            jwt.verify(token, String(process.env.JWTKEY));
            } catch (error) {
                if (error instanceof jwt.JsonWebTokenError) {
                    return {401: 'Token is unauthorized'};
                } else {
                return {400: 'Error with request'};     
                }
            }
        return {200: 'Success'};
    }
}