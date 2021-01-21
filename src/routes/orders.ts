import * as express from 'express';
import { Request, Response } from "express";
import { OrderModel } from '../models/OrderModel';
import { SQL } from './products';

const router = express.Router();
const orderModel = new OrderModel();

// TODO: Needs to require JWT
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    try {
        const dbRes: SQL = await orderModel.getByUserId(id);
        dbRes.rowCount === 0
            ? res.send('Order not found')
            : res.send(dbRes.rows);
    } catch (error: unknown) {
        res.send(error);
    }
});

module.exports = router;