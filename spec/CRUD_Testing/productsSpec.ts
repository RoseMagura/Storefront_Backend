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

// Any is necessary here to allow the function
// to process a wide variety of potential values
const isSQL = (sql: any): sql is SQL => {
    return 'rows' in sql && 'rowCount' in sql;
};

const getSQL = async (id: number): Promise<SQL | null> => {
    const dbRes = await mockProductModel.getById(id);
    if (dbRes && isSQL(dbRes)) {
        return dbRes;
    }
    return null;
};

const getAllSQL = async (): Promise<SQL | null> => {
    const dbRes = await mockProductModel.getAll();
    if (dbRes && isSQL(dbRes)) {
        return dbRes;
    }
    return null;
};

const post = async (name: string, price: number): Promise <SQL | null> => {
    const postRes = await mockProductModel.create(name, price);
    if (postRes && isSQL(postRes)) {
        return postRes;
    }
    return null;
}

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
        const dbRes = await getAllSQL();
        expect(dbRes).toBeDefined();
        // The any here is consistent with the SQL interface,
        // which is necessary for flexibility (see SQL interface)
        const rows: any = dbRes !== null && dbRes.rows !== undefined && dbRes.rows;
        rows.forEach((prod: Product) => {
            expect(prod.name).toBeDefined();
            expect(prod.price).toBeDefined();
            expect(prod.product_id).toBeDefined();
        });
    });
});

describe('Get one product test', () => {
    it('checks that selecting by id works', async () => {
        const all = await getAllSQL();
        expect(all).toBeDefined();
        if (all !== null && all.rows !== undefined) {
            const id = all.rows[0].product_id;
            const product = await getSQL(id);
            if (product === null || product.rows === undefined) {
                fail('Error with response from database for product (by id).')
            } else{
            expect(product.rows[0].name).toBeDefined();
            expect(product.rows[0].price).toBeDefined();
            expect(product.rows[0].product_id).toBeDefined();
        }
        } else {
            fail('Error with response from database for all products.');
        }

    });
});

describe('Post a product test', () => {
    it('checks that a product can be created', async () => {
        const res = await post('rice', 5);
        if (res === null) {
            fail('Response from database is null');
        } else{
            expect(res.command).toBe('INSERT');
            expect(res.rowCount).toBe(1);
            const newProduct: SQL = await testQuery(
                `SELECT * FROM PRODUCTS WHERE NAME='rice';`
            );
            if (newProduct.rows !== undefined) {
                expect(newProduct.rows[0].price).toBe('5');
            }
        }
    });
});
