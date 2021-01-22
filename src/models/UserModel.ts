import { query } from '../db/index';
import { SQL } from '../routes/products';
import * as bcrypt from 'bcrypt';

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

    getByName(firstName: string, lastName: string): SQL | unknown {
        try {
            return query(`SELECT * FROM USERS WHERE first_name=\'${firstName}\' and last_name=\'${lastName}\'`);
        } catch (error: unknown) {
            return error;
        }
    }

    async create(firstName: string, lastName: string, password: string): Promise<SQL | unknown> {
        try {
            const hashVal = await bcrypt.hash(password, 10);
            return query(
                `INSERT INTO USERS (first_name, last_name, password) VALUES (\'${firstName}\', \'${lastName}\', \'${hashVal}\');`
            );
        } catch (error: unknown) {
            return error;
        }
    }
}
