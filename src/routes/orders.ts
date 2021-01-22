import * as express from 'express';
import { Request, Response } from "express";
import { OrderModel } from '../models/OrderModel';
import { SQL } from './products';
import { checkToken } from '../auth';

const router = express.Router();
const orderModel = new OrderModel();

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    const tokenStatus = checkToken(req.cookies.token);
    const id = parseInt(req.params.id);
    if(tokenStatus == 'Success') {
        try {
            const dbRes: SQL = await orderModel.getByUserId(id);
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