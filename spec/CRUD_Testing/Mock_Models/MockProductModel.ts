import { testQuery } from '../../../src/db/index';
import { SQL } from '../../../src/interfaces/SQL';

export class MockProductModel {
    getAll(): SQL | unknown {
        try {
            return testQuery('SELECT * FROM PRODUCTS');
        } catch (error: unknown) {
            return error;
        }
    }

    getById(id: number): SQL | unknown {
        try {
            return testQuery(`SELECT * FROM PRODUCTS WHERE product_id = ${id}`);
        } catch (error: unknown) {
            return error;
        }
    }

    create(name: string, price: number): SQL | unknown {
        try {
            return testQuery(
                `INSERT INTO products (name, price) VALUES ('${name}', ${price})`
            );
        } catch (error: unknown) {
            return error;
        }
    }
}
