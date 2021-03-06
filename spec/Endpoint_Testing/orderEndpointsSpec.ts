import * as http from 'http';
import { getRealUser } from './serverSpec';
import { query } from '../../src/db/index';
import { UserModel } from '../../src/models/UserModel';
import { User } from '../../src/interfaces/User';

export const logIn = async (
    firstName: string | undefined,
    lastName: string | undefined,
    password: string | undefined
): Promise<unknown> => {
    const postData = JSON.stringify({
        firstName,
        lastName,
        password,
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

    const headers: string[] = [];
    const processRequest = async () => {
        return new Promise((resolve, reject) => {
            const req = http.request(options, (res: http.IncomingMessage) => {
                res.on('data', () => {
                    if (res.headers['set-cookie'] !== undefined) {
                        const cookie: string = res.headers['set-cookie'][0];
                        headers.push(cookie);
                    } else {
                        reject('NO COOKIE');
                    }
                });
                res.on('end', () => {
                    resolve(headers);
                });
            });
            req.on('error', (e) => reject(e.message));
            req.write(postData);
            req.end();
        });
    };
    return await processRequest();
};

// In case orders and/or users is empty
beforeAll(async () => {
    const orders = await query('SELECT * FROM ORDERS;');
    let users = await query('SELECT * FROM USERS;');
    const userModel = new UserModel();
    if (users.rowCount == 0) {
        await userModel.create('User', 'One', '??3adxeurd');
    }
    if (orders.rowCount == 0) {
        // Rerun in case users was empty before and has been updated
        users = await query('SELECT * FROM USERS;');
        const user = users.rows[0];
        await query(
            `INSERT INTO ORDERS (order_id, "numProducts", user_id, completed) VALUES (1, 1, ${user.user_id}, true);`
        );
    }
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
});

describe('Checking orders (GET)', () => {
    it('fetches order by user id', async () => {
        const user: User = await getRealUser();
        const { first_name, last_name, password } = user;
        const token = await logIn(
            first_name,
            last_name,
            password
        ).catch((err: unknown) => fail(err));
        const options: Record<string, unknown> = {
            host: '0.0.0.0',
            port: '3000',
            path: `/orders/${user.user_id}`,
            method: 'GET',
            headers: {
                Cookie: token,
            },
        };
        const req = http.request(options, (res: http.IncomingMessage) => {
            expect(res.statusCode).toBe(200);
            res.setEncoding('utf-8');
            res.on('data', (chunk: string) => {
                expect(chunk.includes('order_id')).toBe(true);
                expect(chunk.includes('user_id')).toBe(true);
                expect(chunk.includes('numProducts')).toBe(true);
                expect(chunk.includes('completed')).toBe(true);
            });
        });
        req.end();
    });

    it('rejects if no JWT', async () => {
        const user: User = await getRealUser();
        http.get(
            `http://localhost:3000/orders/${user.user_id}`,
            (res: http.IncomingMessage) => {
                expect(res.statusCode).toBe(401);
                res.setEncoding('utf-8');
                res.on('data', (chunk: string) => {
                    expect(chunk).toBe(
                        'This endpoint requires JWT. Please login'
                    );
                });
            }
        );
    });
});
