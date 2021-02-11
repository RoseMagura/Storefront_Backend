import * as express from 'express';
import { Request, Response } from 'express';
import { OrderModel } from '../models/OrderModel';
import { checkToken } from '../auth';
import { HttpCode } from '../interfaces/HttpCode';
import { SQL } from '../interfaces/SQL';
import { Product } from '../interfaces/Product';

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
    const tokenStatus: HttpCode = checkToken(req.cookies.token);
    const { userId, completed, products } = req.body;
    if (tokenStatus.code == 200) {
        try {
            const dbRes = await postOrderGetSQL(userId, completed, products);
            if (dbRes !== null) { 
                dbRes.rowCount === 0
                    ? res.send(JSON.stringify(`Could not create order for user ${userId}.`)) // CHANGE ME
                    : res.send(JSON.stringify(`Successfully created order for user ${userId}.`));
            }
        } catch (error: unknown) {
            res.send(JSON.stringify(error));
        }
    } else {
        res.status(tokenStatus.code);
        res.send(JSON.stringify(tokenStatus.message));
    }
})

export default router;
