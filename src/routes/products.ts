import * as express from 'express';
import { Request, Response } from "express";
import { ProductModel } from '../models/ProductModel';

const router = express.Router();
const productModel = new ProductModel();

export interface SQL {
    rows?: object,
    rowCount?: number
}

router.get('', async (req: Request, res: Response): Promise<void> => {
    try {
        res.send(await productModel.getAll());
    } catch (error: unknown) {
        res.send(error);
    }
});

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    try {
        const dbRes: SQL = await productModel.getById(id);
        dbRes.rowCount === 0
            ? res.send('Product not found')
            : res.send(dbRes.rows);
    } catch (error: unknown) {
        res.send(error);
    }
});

// TODO: Needs to require JWT
router.post('', async (req: Request, res: Response): Promise<void> => {
    const { name, price } = req.body;
    const dbRes: SQL = await productModel.create(name, price);
    dbRes.rowCount === 1 
        ? res.send(`Sucessfully created ${name}`)
        : res.send(`Error creating ${name}`);
});


module.exports = router;