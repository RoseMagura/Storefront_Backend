import { testQuery } from '../../../src/db';
import { SQL } from '../../../src/interfaces/SQL';
import * as bcrypt from 'bcrypt';

export class MockUserModel {
    getAll(): SQL | unknown {
        try {
            return testQuery('SELECT * FROM USERS');
        } catch (error: unknown) {
            return error;
        }
    }

    getById(id: number): SQL | unknown {
        try {
            return testQuery(`SELECT * FROM USERS WHERE user_id = ${id}`);
        } catch (error: unknown) {
            return error;
        }
    }

    getByName(firstName: string, lastName: string): SQL | unknown {
        try {
            return testQuery(
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
            return testQuery(
                `INSERT INTO USERS (first_name, last_name, password) VALUES ('${firstName}', '${lastName}', '${hashVal}');`
            );
        } catch (error: unknown) {
            return error;
        }
    }
}
