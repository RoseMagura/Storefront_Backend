import { getUser } from '../CRUD_Testing/ordersSpec';
import { query } from '../../src/db';
import { UserModel } from '../../src/models/UserModel';
// import { Request, Response } from 'express';
import * as http from 'http';
import { checkToken } from '../../src/auth';
import * as cookieParser from 'cookie-parser';
import * as jwt from 'jsonwebtoken';

// Server needs to be running at this URL
// Can be run with `yarn watch` in the root directory
const baseUrl = 'http://localhost:3000/';

const getRealUser = async () => {
    const users = await query('SELECT * FROM USERS;');
    if (users.rowCount === 0) {
        const userModel = new UserModel();
        await userModel.create('Customer', 'One', 'securePassword');
    }
    return users.rows[0];
};

describe('Checking root endpoint (GET)', () => {
    it('Returns a helpful message', () => {
        http.get(baseUrl, (res) => {
            expect(res.statusCode).toBe(200);
            res.setEncoding('ascii');
            res.on('data', (chunk) => expect(chunk).toBe('Please Login.'));
        });
    });
});

describe('Checking root endpoint (POST)', () => {
    it('Returns JWT in the cookie after logging in', async () => {
        const user = await getRealUser();
        const postData = JSON.stringify({
            firstName: user.first_name,
            lastName: user.last_name,
            password: user.password,
        });

        const options = {
            host: '0.0.0.0',
            port: '3000',
            path: '/',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const postReq = http.request(options, (res: any) => {
            expect(res.statusCode).toBe(200);
            if (res.headers['set-cookie'] !== undefined) {
                const cookie: string = res.headers['set-cookie'][0];
                const fullToken = cookie.split(';')[0];
                const justJWT = fullToken.split('=')[1];
                expect(checkToken(justJWT)).toBeTrue;
            } else {
                fail('NO COOKIE');
            }
            res.setEncoding('ascii');
            res.on('data', (chunk: any) => {
                expect(chunk).toBe(
                    `${user.first_name} ${user.last_name} successfully logged in!`
                );
            });
        });

        postReq.on('error', (e: any) => {
            console.error(`problem with request: ${e.message}`);
        });

        postReq.write(postData);
        postReq.end();
    });
});
