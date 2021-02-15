import { query } from '../db/index';
import { Order } from '../interfaces/Order';
import { Product } from '../interfaces/Product';
import { SQL } from '../interfaces/SQL';

export class OrderModel {
    getAll(): SQL | unknown {
        try {
            return query('SELECT * FROM ORDERS');
        } catch (error: unknown) {
            return error;
        }
    }

    getByUserId(id: number): SQL | unknown {
        try {
            return query(`SELECT * FROM ORDERS JOIN ORDER_PRODUCTS ON (ORDERS.ORDER_ID=ORDER_PRODUCTS.ORDER_ID) WHERE user_id = ${id}`);
        } catch (error: unknown) {
            return error;
        }
    }

    async createOrder(
        userId: number,
        completed: boolean,
        products: Product[]
    ): Promise<SQL | unknown> {
        const all = await query('SELECT * FROM ORDERS');
        // Find last order's ID and add one to get the next order ID
        const sorted = all.rows.sort((a: Order, b: Order) => b.order_id - a.order_id);
        const orderId =
            all.rowCount === 0 ? 1 : sorted[0].order_id + 1;
        const numProducts = products.length;
        try {
            // First, insert the order into orders table
            const orderRes = await query(
                `INSERT INTO ORDERS (order_id, "numProducts", user_id, completed) VALUES (${orderId}, ${numProducts}, ${userId}, ${completed});`
            );

            // Sort product array by product id
            products.sort((a, b) => a.product_id - b.product_id);

            // set up variables to count how many of each product
            let prev: number;
            let numbers: number[] = [];
            let count: number[] = [];

            products.forEach((product) => {
                // check if product is the same as the last one
                if (product.product_id !== prev) {
                    // if different, just add with freq of one
                    numbers.push(product.product_id);
                    count.push(1);
                } else {
                    // increase that item's freq
                    count[count.length - 1]++;
                }
                // update prev variable
                prev = product.product_id;
            });

            for (let i = 0; i < numbers.length; i++) {
                const statement = `INSERT INTO ORDER_PRODUCTS (order_id, product_id, count) VALUES (${orderId}, ${numbers[i]}, ${count[i]});`;
                try {
                    await query(statement);
                } catch (error) {
                    console.error(error);
                }
            }
            return orderRes;
        } catch (error: unknown) {
            return error;
        }
    }
}
