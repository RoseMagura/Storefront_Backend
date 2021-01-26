import 'jasmine';
import { testQuery } from '../../src/db/index';
import { SQL } from '../../src/interfaces/SQL';
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
        const dbRes: any = await mockProductModel.getAll();
        expect(dbRes).not.toBeNull();
        for (let i = 0; i < data.length; i++) {
            expect(dbRes[i].name).toBe(data[i].name);
            expect(dbRes[i].price).toBe(data[i].price);
        }
    });
});

describe('Get one product test', () => {
    it('checks that selecting by id works', async () => {
        const all = await mockProductModel.getAll();
        const id = all[0].product_id;
        const product = await mockProductModel.getById(id);
        expect(product.rows[0].name).toBe(data[0].name);
        expect(product.rows[0].price).toBe(data[0].price);
    });
});

describe('Post a product test', () => {
    it('checks that a product can be created', async () => {
        const res: SQL = await mockProductModel.create('rice', 5);
        expect(res.command).toBe('INSERT');
        expect(res.rowCount).toBe(1);
        const all = await mockProductModel.getAll();
        // new product will be the fourth of the products
        const newProduct = all[3];
        expect(newProduct.name).toBe('rice');
        expect(newProduct.price).toBe('5');
    });
});
