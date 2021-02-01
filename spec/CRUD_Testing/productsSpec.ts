import 'jasmine';
import { testQuery } from '../../src/db/index';
import { SQL } from '../../src/interfaces/SQL';
import { Product } from '../../src/interfaces/Product';
import { MockProductModel } from './Mock_Models/MockProductModel';

const data = [
    { name: 'green mossy gourd', price: '1800' },
    { name: 'mottled purple gourd', price: '1800' },
    { name: 'withered red gourd', price: '1000' },
];

const mockProductModel = new MockProductModel();

beforeAll(async () => {
    const products = await testQuery('SELECT * FROM PRODUCTS;');
    if (products.rowCount === 0) {
        for (let i = 0; i < data.length; i++) {
            await testQuery(
                `INSERT INTO PRODUCTS(NAME, PRICE) VALUES('${data[i].name}', ${data[i].price});`
            );
        }
    }
    await testQuery(`DELETE FROM PRODUCTS WHERE NAME='rice';`);
});

describe('Get all products test', () => {
    it('checks that select all works', async () => {
        const dbRes: Product[] = await mockProductModel.getAll();
        expect(dbRes).toBeDefined();
        dbRes.forEach((prod) => {
            expect(prod.name).toBeDefined();
            expect(prod.price).toBeDefined();
            expect(prod.product_id).toBeDefined();
        })
    });
});

describe('Get one product test', () => {
    it('checks that selecting by id works', async () => {
        const all: Product[] = await mockProductModel.getAll();
        const id = all[0].product_id;
        const product = await mockProductModel.getById(id);
        expect(product.rows[0].name).toBeDefined();
        expect(product.rows[0].price).toBeDefined();
        expect(product.rows[0].product_id).toBeDefined();
    });
});

describe('Post a product test', () => {
    it('checks that a product can be created', async () => {
        const res: SQL = await mockProductModel.create('rice', 5);
        expect(res.command).toBe('INSERT');
        expect(res.rowCount).toBe(1);
        const newProduct: SQL = await testQuery(`SELECT * FROM PRODUCTS WHERE NAME='rice';`);
        if(newProduct.rows !== undefined){
            expect(newProduct.rows[0].price).toBe('5');
        }
    });
});
