import * as http from 'http';
import { getRealUser } from './serverSpec';
import { logIn } from './orderEndpointsSpec';
import { query } from '../../src/db';
import { UserModel } from '../../src/models/UserModel';
import { User } from '../../src/interfaces/User';
import { SQL } from '../../src/interfaces/SQL';
import { RequestOptions } from 'https';

// In case users is empty
beforeAll(async () => {
    const users: SQL = await query('SELECT * FROM USERS;');
    if (users.rowCount == 0) {
        const userModel = new UserModel();
        await userModel.create('User', 'One', '??3adxeurd');
    }
});

describe('Test getting a user', () => {
    it('requires JWT', () => {
        const options: RequestOptions = {
            host: '0.0.0.0',
            port: '3000',
            path: `/users`,
            method: 'GET',
        };
        const req = http.request(options, (res) => {
            expect(res.statusCode).toBe(401);
            res.setEncoding('utf-8');
            res.on('data', (chunk: string) => {
                expect(chunk).toBe('This endpoint requires JWT. Please login');
            });
        });
        req.end();
    });

    it('gets by id succesfully', async () => {
        const user: User = await getRealUser();
        const jwt: unknown = await logIn(
            user.first_name,
            user.last_name,
            user.password
        );
        const options: Record<string, unknown> = {
            host: '0.0.0.0',
            port: '3000',
            path: `/users/${user.user_id}`,
            method: 'GET',
            headers: {
                Cookie: jwt,
            },
        };
        const req = http.request(options, (res: http.IncomingMessage) => {
            expect(res.statusCode).toBe(200);
            res.setEncoding('utf-8');
            res.on('data', (chunk: string) => {
                if (chunk == '{}') {
                    console.error('empty data');
                    fail('Issue with database response');
                }
                console.info('from user endpoint test', chunk);

                expect(chunk.includes('user_id')).toBe(true);
                expect(chunk.includes('first_name')).toBe(true);
                expect(chunk.includes('last_name')).toBe(true);
                expect(chunk.includes('password')).toBe(true);

                const allParts = chunk.split(',');
                const arr: string[] = [];

                allParts.forEach((item) => {
                    arr.push(
                        item
                            .split(':')[1]
                            .replace('[{', '')
                            .replace('}]', '')
                            .replace(/"/g, '')
                    );
                });

                expect(arr[0]).toBeDefined();
                expect(arr[1]).toBeDefined();
                expect(arr[2]).toBeDefined();
                expect(arr[3]).toBeDefined();

                expect(parseInt(arr[0])).toEqual(user.user_id);
                expect(arr[1]).toBe(String(user.first_name));
                expect(arr[2]).toBe(String(user.last_name));
                expect(arr[3]).toBe(user.password);
            });
        });
        req.end();
    });
});

describe('Test posting a user', () => {
    it('requires JWT', () => {
        const options: RequestOptions = {
            host: '0.0.0.0',
            port: '3000',
            path: `/users`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const data = JSON.stringify({
            firstName: 'Test',
            lastName: 'User',
            password: '45test0~%pwd',
        });
        const req = http.request(options, (res) => {
            expect(res.statusCode).toBe(401);
            res.setEncoding('utf-8');
            res.on('data', (chunk: string) => {
                expect(chunk).toBe('This endpoint requires JWT. Please login');
            });
        });
        req.write(data);
        req.end();
    });

    it('posts user with a valid JWT succesfully', async () => {
        const user: User = await getRealUser();
        const token = await logIn(
            user.first_name,
            user.last_name,
            user.password
        );
        const options: Record<string, unknown> = {
            host: '0.0.0.0',
            port: '3000',
            path: `/users`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Cookie: token,
            },
        };
        const data = JSON.stringify({
            firstName: 'Test',
            lastName: 'User',
            password: '45test0~%pwd',
        });
        const req = http.request(options, (res) => {
            console.info(res.statusCode);
            expect(res.statusCode).toBe(200);
            res.setEncoding('utf-8');
            res.on('data', (chunk: string) => {
                console.info(chunk);
                expect(chunk).toBe(`Successfully created User Test User`);
            });
        });
        req.write(data);
        req.end();
    });
});
