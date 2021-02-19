import { query } from '../db/index';
import { SQL } from '../interfaces/SQL';
import * as bcrypt from 'bcryptjs';

export class UserModel {
    getAll(): SQL | unknown {
        try {
            return query('SELECT * FROM USERS');
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
            return query(
                `SELECT * FROM USERS WHERE first_name='${firstName}' and last_name='${lastName}'`
            );
        } catch (error: unknown) {
            return error;
        }
    }

    async create(
        firstName: string,
        lastName: string,
        password: string
    ): Promise<SQL | unknown> {
        try {
            const hashVal = await bcrypt.hash(password, 10);
            return query(
                `INSERT INTO USERS (first_name, last_name, password) VALUES ('${firstName}', '${lastName}', '${hashVal}');`
            );
        } catch (error: unknown) {
            return error;
        }
    }
}
