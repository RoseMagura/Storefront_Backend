import * as express from 'express';
import { Request, Response } from 'express';
import { ProductModel } from '../models/ProductModel';
import { checkToken } from '../auth';
import { SQL } from '../interfaces/SQL';
import { raw } from 'body-parser';

const router = express.Router();
const productModel = new ProductModel();

// Any is necessary here to allow the function
// to process a wide variety of potential values
const isSQL = (sql: any): sql is SQL => {
    return 'rows' in sql && 'rowCount' in sql;
};

const getProductSQL = async (id: number): Promise<SQL | null> => {
    const dbRes = await productModel.getById(id);
    if (dbRes && isSQL(dbRes)) {
        return dbRes;
    }
    return null;
};

const getAllProductsSQL = async (): Promise<SQL | null> => {
    const dbRes = await productModel.getAll();
    if (dbRes && isSQL(dbRes)) {
        return dbRes;
    }
    return null;
}

const postProductGetSQL = async (name: string, price: number): Promise<SQL | null> => {
    const postRes = await productModel.create(name, price);
    if (postRes && isSQL(postRes)) {
        return postRes;
    }
    return null;
}

router.get(
    '',
    async (req: Request, res: Response): Promise<void> => {
        const rawSQL = await getAllProductsSQL();
        try {
            res.send(rawSQL !== null && rawSQL.rows);
        } catch (error: unknown) {
            res.send(error);
        }
    }
);

router.get(
    '/:id',
    async (req: Request, res: Response): Promise<void> => {
        const id = parseInt(req.params.id);
        try {
            const dbRes = await getProductSQL(id);
            if (dbRes !== null) {
                dbRes.rowCount === 0
                    ? res.send('Product not found')
                    : res.send(dbRes.rows);
            }
        } catch (error: unknown) {
            res.send(error);
        }
    }
);

router.post(
    '',
    async (req: Request, res: Response): Promise<void> => {
        const { name, price } = req.body;
        const tokenStatus = checkToken(req.cookies.token);
        if (tokenStatus.code == 200) {
            try {
                const dbRes = await postProductGetSQL(name, price);
                if (dbRes !== null){
                    dbRes.rowCount === 1
                        ? res.send(`Sucessfully created ${name}`)
                        : res.send(`Error creating ${name}`);
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
