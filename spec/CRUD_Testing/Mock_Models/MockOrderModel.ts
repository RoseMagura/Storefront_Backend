import { testQuery } from '../../../src/db/index';
import { SQL } from '../../../src/interfaces/SQL';

export class MockOrderModel {
    getAll(): any {
        try {
            return testQuery('SELECT * FROM ORDERS').then(
                (res: SQL) => res.rows
            );
        } catch (error: unknown) {
            return error;
        }
    }

    getByUserId(id: number): any {
        try {
            return testQuery(`SELECT * FROM ORDERS WHERE user_id = ${id}`);
        } catch (error: unknown) {
            return error;
        }
    }
}
