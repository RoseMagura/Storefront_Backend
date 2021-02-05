import * as express from 'express';
import { Request, Response } from 'express';
import { OrderModel } from '../models/OrderModel';
import { checkToken } from '../auth';
import { HttpCode } from '../interfaces/HttpCode';
import { SQL } from '../interfaces/SQL';

const router = express.Router();
const orderModel = new OrderModel();

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

router.get(
    '/:id',
    async (req: Request, res: Response): Promise<void> => {
        const tokenStatus: HttpCode = checkToken(req.cookies.token);

        const id: number = parseInt(req.params.id);
        if (tokenStatus.code == 200) {
            try {
                const dbRes = await getSQL(id);
                if(dbRes !== null){
                    dbRes.rowCount === 0
                        ? res.send(`Order for user ${id} not found`)
                        : res.send(dbRes.rows);
                }
            } catch (error: unknown) {
                res.send(error);
            }
        } else {
            res.status(tokenStatus.code);
            res.send(tokenStatus.message);
        }
    }
);

export default router;
