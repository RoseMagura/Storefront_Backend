import 'jasmine';
import { testQuery } from '../../src/db/index';
import { Order } from '../../src/interfaces/Order';
import { SQL } from '../../src/interfaces/SQL';
import { User } from '../../src/interfaces/User';
import { MockOrderModel } from './Mock_Models/MockOrderModel';
import { MockUserModel } from './Mock_Models/MockUserModel';

const mockOrderModel = new MockOrderModel();
const mockUserModel = new MockUserModel();

export const getUser = async (): Promise<User> => {
    let users = await testQuery('SELECT * FROM USERS;');
    if (users.rowCount === 0) {
        await mockUserModel.create('Customer', 'One', 'securePassword');
    }
    users = await testQuery('SELECT * FROM USERS;');
    return users.rows[0];
};
// Before all, check that values are what they should be
beforeAll(async () => {
    const orders = await testQuery('SELECT * FROM ORDERS;');
    if (orders.rowCount === 0) {
        const u = await getUser();
        await testQuery(
            `INSERT INTO ORDERS(order_id, "numProducts", user_id, completed) VALUES(1, 2, ${u.user_id}, false);`
        );
    }
});

describe('Get all orders test', () => {
    it('checks that select all works', async () => {
        const dbRes: any = await mockOrderModel.getAll();
        const user = await getUser();
        expect(dbRes).not.toBeNull();
        const firstOrder: Order = dbRes[0];
        expect(firstOrder.order_id).toBe(1);
        expect(firstOrder.numProducts).toBe(2);
        expect(firstOrder.user_id).toBe(user.user_id);
        expect(firstOrder.completed).toBeFalse;
    });
});

describe('Get one order test', () => {
    it('checks that selecting order by user id works', async () => {
        const user = await getUser();
        const orderInfo: SQL = await mockOrderModel.getByUserId(user.user_id);
        const rows: any = orderInfo.rows;
        expect(orderInfo.command).toBe('SELECT');
        expect(orderInfo.rowCount).toBe(1);
        expect(rows[0].order_id).toBe(1);
        expect(rows[0].numProducts).toBe(2);
        expect(rows[0].user_id).toBe(user.user_id);
        expect(rows[0].completed).toBeFalse;
    });
});
