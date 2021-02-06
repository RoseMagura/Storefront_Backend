import { query } from '../db/index';
import { SQL } from '../interfaces/SQL';

export class ProductModel {
    getAll(): SQL | unknown {
        try {
            return query('SELECT * FROM PRODUCTS');
        } catch (error: unknown) {
            return error;
        }
    }

    getById(id: number): SQL | unknown {
        try {
            return query(`SELECT * FROM PRODUCTS WHERE product_id = ${id}`);
        } catch (error: unknown) {
            return error;
        }
    }

    create(name: string, price: number): SQL | unknown {
        try {
            return query(
                `INSERT INTO products (name, price) VALUES ('${name}', ${price})`
            );
        } catch (error: unknown) {
            return error;
        }
    }
}
