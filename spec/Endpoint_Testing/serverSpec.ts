import { query } from '../../src/db';
import { UserModel } from '../../src/models/UserModel';
import * as http from 'http';
import { checkToken } from '../../src/auth';
import { User } from '../../src/interfaces/User';

// Server needs to be running at this URL
// Can be run with `yarn watch` in the root directory
export const baseUrl = 'http://localhost:3000/';

export const getRealUser = async (): Promise<User> => {
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
   fit('Returns JWT in the cookie after logging in', async () => {
        const user = await getRealUser();
        const postData = JSON.stringify({
            firstName: user.firstName,
            lastName: user.lastName,
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

        const postReq = http.request(options, async (res: http.IncomingMessage) => {
            expect(res.statusCode).toBe(200);
            if (res.headers['set-cookie'] !== undefined) {
                const cookie: string = res.headers['set-cookie'][0];
                const fullToken = cookie.split(';')[0];
                const justJWT = fullToken.split('=')[1];
                // const authorized = checkToken(justJWT);
                // expect(authorized.code).toBe(200);
                // expect(authorized.message).toBe('Success');
            } else {
                fail('NO COOKIE');
            }
            res.setEncoding('ascii');
            res.on('data', (chunk: string) => {
                expect(chunk).toBe(
                    `${user.firstName} ${user.lastName} successfully logged in!`
                );
            });
        });

        postReq.on('error', (e: unknown) => {
            console.error(`problem with request: ${e}`);
        });

        postReq.write(postData);
        postReq.end();
    });
});
