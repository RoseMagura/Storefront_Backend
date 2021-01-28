import * as express from 'express';
import { Request, Response } from "express";
import { ProductModel } from '../models/ProductModel';
import { checkToken } from '../auth';
import { SQL } from '../interfaces/SQL';

const router = express.Router();
const productModel = new ProductModel();

export const isSQL = (sql: any): sql is SQL => {
    return "rows" in sql && "rowCount" in sql;
}

const getSQL = async (id: number ): Promise<SQL | null> => {
    const dbRes = await productModel.getById(id);
    if(dbRes && isSQL(dbRes)){
        return dbRes;
    }
    return null;
}

router.get('', async (req: Request, res: Response): Promise<void> => {
    try {
        console.log('ACCESSING PRODUCTS');
        res.send(await productModel.getAll());
    } catch (error: unknown) {
        res.send(error);
    }
});

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    try {
        const dbRes = await getSQL(id);
        if(dbRes !== null) {
            dbRes.rowCount === 0
            ? res.send('Product not found')
            : res.send(dbRes.rows);
        }
    } catch (error: unknown) {
        res.send(error);
    }
});

router.post('', async (req: Request, res: Response): Promise<void> => {
    const { name, price } = req.body;
    const tokenStatus = checkToken(req.cookies.token);
    if(tokenStatus == 'Success') {
        try {
            const dbRes: any = await productModel.create(name, price);
            dbRes.rowCount === 1 
            ? res.send(`Sucessfully created ${name}`)
            : res.send(`Error creating ${name}`);
        } catch (error: unknown) {
            res.send(error);
        }
    } else {
        res.send(tokenStatus);
    }
});

module.exports = router;