import { getUser } from '../CRUD_Testing/ordersSpec';
import * as request from 'request';
import * as bcrypt from 'bcrypt';
import { query } from '../../src/db';
import { UserModel } from '../../src/models/UserModel';
// import { Request, Response } from 'express';
import * as http from 'http';

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
    fit('Returns a helpful message', () => {
        http.get(baseUrl, (res) => {
            expect(res.statusCode).toBe(200);
            res.setEncoding('ascii');
            res.on('data', (chunk) => (expect(chunk).toBe('Please Login.')));
        });
    });
});

// describe('Checking root endpoint (POST)', () => {
//     fit('Returns JWT in the cookie after logging in', async () => {
//         const user = await getRealUser();
//         console.log(user.first_name);
//         const options = {
//             method: 'POST',
//             uri: baseUrl,
//             // body: {'firstName': user.first_name}
//             multipart: [
//                 {
//                     'content-type': 'application/json',
//                     'body': JSON.stringify({
//                         'firstName': user.first_name,
//                         'lastName': user.last_name,
//                         'password': user.password,
//                     }),
//                 },
//             ],
//         };
//         request.post(options, (err, res, body) => {
//             if (err) {
//                 // fail(err);
//                 console.log(err);
//                 console.log(body);
//             }
//             // console.log(res.headers['set-cookie']);
//             // console.log(body);
//             console.log(res);
//             // expect(res.statusCode).toBe(200);
//             // expect(res.headers['set-cookie']).not.toBeNull;
//             // expect(body).toBe(`succesfully logged in!`);
//         });
//     });
// });
