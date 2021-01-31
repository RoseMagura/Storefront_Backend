import * as http from 'http';
import { query } from '../../src/db/index';

beforeAll(async () => {
    const products = await query('SELECT * FROM PRODUCTS');
    if (products.rowCount == 0) {
        await query(`INSERT INTO PRODUCTS (name, price) VALUES ('X', 5);`);
    }
});

describe('A product test suite', () => {
    it('checks getting all products', () => {
        const req = http.get('http://localhost:3000/products/', (res: http.IncomingMessage) => {
            expect(res.statusCode).toBe(200);
            res.on('data', (chunk: string) => {
                expect(chunk.includes('product_id')).toBeTrue;
                expect(chunk.includes('name')).toBeTrue;
                expect(chunk).not.toBeNull;
            });
            res.on('error', (e: unknown) => fail(e));
        });
        req.on('error', (e: unknown) => console.error(e));
    });
});
