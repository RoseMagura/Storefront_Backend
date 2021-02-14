import * as express from 'express';
import { Request, Response } from 'express';
import { OrderModel } from '../models/OrderModel';
import { checkToken } from '../auth';
import { HttpCode } from '../interfaces/HttpCode';
import { SQL } from '../interfaces/SQL';
import { Product } from '../interfaces/Product';
import { query } from '../db';

const router = express.Router();
const orderModel = new OrderModel();

// Any is necessary here to allow the function
// to process a wide variety of potential values
const isSQL = (sql: any): sql is SQL => {
    return 'rows' in sql && 'rowCount' in sql;
};

const getSQL = async (id: number): Promise<SQL | null> => {
    const dbRes = await orderModel.getByUserId(id);
    if (dbRes && isSQL(dbRes)) {
        return dbRes;
    }
    return null;
};

const postOrderGetSQL = async (userId: number, completed: boolean, products: Product[]): Promise<SQL | null> => {
    const dbRes = await orderModel.createOrder(userId, completed, products);
    // console.log(dbRes);
    if (dbRes && isSQL(dbRes)) {
        return dbRes;
    }
    return null;
};

router.get(
    '/:id',
    async (req: Request, res: Response): Promise<void> => {
        const tokenStatus: HttpCode = checkToken(req.cookies.token);

        const id: number = parseInt(req.params.id);
        if (tokenStatus.code == 200) {
            try {
                const dbRes = await getSQL(id);
                if (dbRes !== null) {
                    dbRes.rowCount === 0
                        ? res.send(JSON.stringify(`Order for user ${id} not found`))
                        : res.send(JSON.stringify(dbRes.rows));
                }
            } catch (error: unknown) {
                res.send(JSON.stringify(error));
            }
        } else {
            res.status(tokenStatus.code);
            res.send(JSON.stringify(tokenStatus.message));
        }
    }
);

router.post('/', async (req: Request, res: Response): Promise<void> => {
    const tokenStatus: HttpCode = checkToken(String(req.headers['set-cookie']));
    const { userId, complete, products } = req.body;
    if (tokenStatus.code == 200) {
        try {
            const dbRes = await postOrderGetSQL(userId, complete, products);
            const allOrders = await query(`SELECT * FROM ORDERS`);
            if (dbRes !== null) { 
                dbRes.rowCount === 0
                    ? res.send(JSON.stringify(`Could not create order for user ${userId}.`))
                    : res.send(JSON.stringify(`Successfully created order #${allOrders.rows[allOrders.rowCount - 1].order_id} for user ${userId}.`));
            }
        } catch (error: unknown) {
            console.error(error);
            res.send(JSON.stringify(error));
        }
    } else {
        console.error(tokenStatus.message);
        res.status(tokenStatus.code);
        res.send(JSON.stringify(tokenStatus.message));
    }
})

router.put('/:orderId', async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.orderId);
    try {
        await query(`UPDATE orders SET "numProducts" = ${req.body.numProducts} WHERE order_id=${id}`);
    } catch (error: unknown) {
        console.error(error);
    }
    // try catch for updating order_products join table
    try {
        if (req.query.action === 'add') {
            const newProduct: number = req.body.toAdd;
            await query(`INSERT INTO order_products(order_id, product_id, count) VALUES (${id}, ${newProduct}, 1);`);
        } 
        else {
            await query(`DELETE FROM order_products WHERE product_id = ${req.body.toDelete} AND order_id=${id};`);
        }
    } catch (error: unknown) {
        console.error(error);
    }
    res.send(JSON.stringify('Editing order'));
})

export default router;
