import { testQuery } from "../../../src/db";
import { SQL } from "../../../src/interfaces/SQL";
import * as bcrypt from 'bcrypt';

export class MockUserModel {

    getAll(): any {
        try {
            return testQuery('SELECT * FROM USERS').then((res: SQL) => res.rows);
        } catch (error: unknown) {
            return error;
        }
    }

    getById(id: number): any {
        try {
            return testQuery(`SELECT * FROM USERS WHERE user_id = ${id}`);
        } catch (error: unknown) {
            return error;
        }
    }

    getByName(firstName: string, lastName: string): any {
        try {
            return testQuery(`SELECT * FROM USERS WHERE first_name=\'${firstName}\' and last_name=\'${lastName}\'`);
        } catch (error: unknown) {
            return error;
        }
    }

    async create(firstName: string, lastName: string, password: string): Promise<any> {
        try {
            const hashVal = await bcrypt.hash(password, 10);
            return testQuery(
                `INSERT INTO USERS (first_name, last_name, password) VALUES (\'${firstName}\', \'${lastName}\', \'${hashVal}\');`
            );
        } catch (error: unknown) {
            return error;
        }
    }
}