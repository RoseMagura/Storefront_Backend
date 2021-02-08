import 'jasmine';
import { testQuery } from '../../src/db/index';
import { Order } from '../../src/interfaces/Order';
import { SQL } from '../../src/interfaces/SQL';
import { User } from '../../src/interfaces/User';
import { MockOrderModel } from './Mock_Models/MockOrderModel';
import { MockUserModel } from './Mock_Models/MockUserModel';

const mockOrderModel = new MockOrderModel();
const mockUserModel = new MockUserModel();

// Any is necessary here to allow the function
// to process a wide variety of potential values
const isSQL = (sql: any): sql is SQL => {
    return 'rows' in sql && 'rowCount' in sql;
};

const getSQL = async (id: number): Promise<SQL | null> => {
    const dbRes = await mockOrderModel.getByUserId(id);
    if (dbRes && isSQL(dbRes)) {
        return dbRes;
    }
    return null;
};

const getAllSQL = async (): Promise<SQL | null> => {
    const dbRes = await mockOrderModel.getAll();
    if (dbRes && isSQL(dbRes)) {
        return dbRes;
    }
    return null;
};

export const getUser = async (): Promise<User> => {
    let users = await testQuery('SELECT * FROM USERS;');
    if (users.rowCount === 0) {
        await mockUserModel.create('Customer', 'One', 'securePassword');
    }
    users = await testQuery('SELECT * FROM USERS;');
    return users.rows[0];
};

describe('Get all orders test', () => {
    it('checks that select all works', async () => {
        const orders = await testQuery('SELECT * FROM ORDERS;');
        if (orders.rowCount === 0) {
            const u = await getUser();
            await testQuery(
                `INSERT INTO ORDERS(order_id, "numProducts", user_id, completed) VALUES(1, 2, ${u.user_id}, false);`
            );
        }
        const dbRes = await getAllSQL();
        expect(dbRes).not.toBeNull();
        const firstOrder: Order =
            dbRes !== null && dbRes.rows !== undefined && dbRes.rows[0];
        expect(firstOrder.order_id).toBe(1);
        expect(firstOrder.numProducts).toBe(2);
        expect(firstOrder.user_id).toBeDefined();
        expect(firstOrder.user_id).toBeInstanceOf(Number);
        expect(firstOrder.completed).toBeFalse;
    });
});

describe('Get one order test', () => {
    it('checks that selecting order by user id works', async () => {
        const all: SQL = await testQuery('SELECT * FROM ORDERS;');
        if (all.rowCount === 0) {
            const user = await getUser();
            await testQuery(
                `INSERT INTO ORDERS(order_id, "numProducts", user_id, completed) VALUES (1, 2, ${user.user_id}, false);`
            );
            const orderInfo = await getSQL(user.user_id);
            // The any here is consistent with the SQL interface,
            // which is necessary for flexibility (see SQL interface)
            const rows: any = orderInfo !== null && orderInfo.rows;
            expect(orderInfo).toBeDefined();
            if (orderInfo !== null) {
                expect(orderInfo.command).toBe('SELECT');
                expect(orderInfo.rowCount).toBe(1);
            }
            expect(rows[0].order_id).toBe(1);
            expect(rows[0].numProducts).toBe(2);
            expect(rows[0].user_id).toBe(user.user_id);
            expect(rows[0].completed).toBeFalse;
        } else {
            const currUser = all.rows !== undefined && all.rows[0].user_id;
            const orderInfo = await getSQL(currUser);
            // The any here is consistent with the SQL interface,
            // which is necessary for flexibility (see SQL interface)
            const rows: any = orderInfo !== null && orderInfo.rows;
            expect(orderInfo).toBeDefined();
            if (orderInfo !== null) {
                expect(orderInfo.command).toBe('SELECT');
                expect(orderInfo.rowCount).toBe(1);
            }
            expect(rows[0].order_id).toBe(1);
            expect(rows[0].numProducts).toBe(2);
            expect(rows[0].user_id).toBe(currUser);
            expect(rows[0].completed).toBeFalse;
        }
    });
});
