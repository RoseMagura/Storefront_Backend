import * as http from 'http';
import { getRealUser } from './serverSpec';

export const logIn = async (firstName: string, lastName: string, password: string): Promise<any> => {
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

    let headers: string[] = [];
    const processRequest = () => {
        return new Promise((resolve, reject) => {
            const req = http.request(options, (res: any) => {
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

describe('Checking orders (GET)', () => {
    it('fetches order by user id', async () => {
        const user = await getRealUser();
        const { first_name, last_name, password } = user;
        const token = await logIn(first_name, last_name, password);
        const options: any = {
            host: '0.0.0.0',
            port: '3000',
            path: `/orders/${user.user_id}`,
            method: 'GET',
            headers: {
                'Cookie': token,
            },
        }
        const req = http.request(options, (res) => {
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
        const user = await getRealUser();
        http.get(`http://localhost:3000/orders/${user.user_id}`, (res) => {
            expect(res.statusCode).toBe(401);
            res.setEncoding('utf-8');
            res.on('data', (chunk: string) => {
                expect(chunk).toBe('This endpoint requires JWT. Please login');
            });
        });
    });
});