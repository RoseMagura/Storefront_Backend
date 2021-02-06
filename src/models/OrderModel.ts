import { query } from '../db/index';
import { SQL } from '../interfaces/SQL';

export class OrderModel {

    getAll(): SQL | unknown {
        try {
            return query('SELECT * FROM ORDERS');
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
