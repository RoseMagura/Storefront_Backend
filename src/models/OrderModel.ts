import { query } from '../db/index';
import { SQL } from '../routes/products';

export class OrderModel {
    id: number;
    name: string;
    price: number;

    getAll(): object | unknown {
        try {
            return query('SELECT * FROM ORDERS').then((res: SQL) => res.rows);
        } catch (error: unknown) {
            return error;
        }
    }

    getByUserId(id: number): SQL | unknown {
        try {
            return query(`SELECT * FROM ORDERS WHERE user_id = ${id}`);
        } catch (error: unknown) {
            return error;
        }
    }

    // create(name: string, price: number): SQL | unknown {
    //     try {
    //         return query(
    //             `INSERT INTO ORDERS (name, price) VALUES (\'${name}\', ${price})`
    //         );
    //     } catch (error: unknown) {
    //         return error;
    //     }
    // }
}
