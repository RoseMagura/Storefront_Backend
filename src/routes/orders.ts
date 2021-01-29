import * as express from 'express';
import { Request, Response } from "express";
import { OrderModel } from '../models/OrderModel';
import { SQL } from '../interfaces/SQL';
import { checkToken } from '../auth';

const router = express.Router();
const orderModel = new OrderModel();

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    const tokenStatus: object = checkToken(req.cookies.token);

    const id: number = parseInt(req.params.id);
    if(Object.keys(tokenStatus)[0] == '200') {
        try {
            const dbRes: any = await orderModel.getByUserId(id);
            dbRes.rowCount === 0
                ? res.send('Order not found')
                : res.send(dbRes.rows);
        } catch (error: unknown) {
            res.send(error);
        }
    } else {
        res.status(parseInt(Object.keys(tokenStatus)[0]));
        res.send(Object.values(tokenStatus)[0]);
    }
});

module.exports = router;