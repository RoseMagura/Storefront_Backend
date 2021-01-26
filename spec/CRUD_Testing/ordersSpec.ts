// import 'jasmine';
// import { testQuery } from '../../src/db/index';
// import { Order } from '../../src/interfaces/Order';
// import { SQL } from '../../src/interfaces/SQL';
// import { MockOrderModel } from './Mock_Models/MockOrderModel';

// const mockOrderModel = new MockOrderModel();

// // Before all, check that values are what they should be
// beforeAll(async () => {
//     const orders = await testQuery('SELECT * FROM ORDERS;');
//     if(orders.rowCount === 0){
//         await testQuery(
//             `INSERT INTO ORDERS(order_id, "numProducts", user_id, completed) VALUES(1, 2, 1, false);`
//         );
//     }
// });

// describe('Get all orders test', () => {
//     it('checks that select all works', async () => {
//         const dbRes: any = await mockOrderModel.getAll();
//         expect(dbRes).not.toBeNull();
//         const firstOrder: Order = dbRes[0];
//         expect(firstOrder.order_id).toBe(1);
//         expect(firstOrder.numProducts).toBe(2);
//         expect(firstOrder.user_id).toBe(1);
//         expect(firstOrder.completed).toBeFalse;
//     });
// });

// describe('Get one order test', () => {
//     it('checks that selecting order by user id works', async () => {
//         const orders: SQL = await mockOrderModel.getByUserId(1);
//         const rows: any = orders.rows;
//         expect(orders.command).toBe('SELECT');
//         expect(orders.rowCount).toBe(1);
//         expect(rows[0].order_id).toBe(1);
//         expect(rows[0].numProducts).toBe(2);
//         expect(rows[0].user_id).toBe(1);
//         expect(rows[0].completed).toBeFalse;
//     })
// });