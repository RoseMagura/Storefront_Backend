import * as express from 'express';
import { Request, Response } from "express";
import { OrderModel } from '../models/OrderModel';
import { SQL } from '../interfaces/SQL';
import { checkToken } from '../auth';

const router = express.Router();
const orderModel = new OrderModel();

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    const tokenStatus: string = checkToken(req.cookies.token);
    const id: number = parseInt(req.params.id);
    if(tokenStatus == 'Success') {
        try {
            const dbRes: any = await orderModel.getByUserId(id);
            dbRes.rowCount === 0
                ? res.send('Order not found')
                : res.send(dbRes.rows);
        } catch (error: unknown) {
            res.send(error);
        }
    } else {
        res.send(tokenStatus);
    }
});

module.exports = router;