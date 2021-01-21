import { query } from '../db/index';
import { SQL } from '../routes/products';

export class UserModel {
    id: number;
    firstName: string;
    lastName: string;
    password: string;

    getAll(): object | unknown {
        try {
            return query('SELECT * FROM USERS').then((res: SQL) => res.rows);
        } catch (error: unknown) {
            return error;
        }
    }

    getById(id: number): SQL | unknown {
        try {
            return query(`SELECT * FROM USERS WHERE user_id = ${id}`);
        } catch (error: unknown) {
            return error;
        }
    }

    // TODO: Store password as encrypted string, not plain text!!
    create(firstName: string, lastName: string, password: string): SQL | unknown {
        try {
            return query(
                `INSERT INTO USERS (first_name, last_name, password) VALUES (\'${firstName}\', \'${lastName}\', \'${password}\');`
            );
        } catch (error: unknown) {
            return error;
        }
    }
}
