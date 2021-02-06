import { testQuery } from '../../../src/db/index';
import { SQL } from '../../../src/interfaces/SQL';

export class MockOrderModel {
    getAll():  SQL | unknown {
        try {
            return testQuery('SELECT * FROM ORDERS');
        } catch (error: unknown) {
            return error;
        }
    }

    getByUserId(id: number):  SQL | unknown {
        try {
            return testQuery(`SELECT * FROM ORDERS WHERE user_id = ${id}`);
        } catch (error: unknown) {
            return error;
        }
    }
}
