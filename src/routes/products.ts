import * as express from 'express';
import { Request, Response } from "express";
import db from '../db/index';

const router = express.Router();

export interface SQL {
    rows: object,
    rowCount: number
}

router.get('/products', (req: Request, res: Response): void => {
    db.query('SELECT * FROM PRODUCTS;', [], (err: object, dbRes: SQL) => {
        if(err) {
            res.send(`${err}`);
        }
        res.send(dbRes.rows);
    });
});

router.get('/products/:id', (req: Request, res: Response): void => {
    const id = req.params.id;
    db.query(`SELECT * FROM PRODUCTS WHERE product_id = ${id};`, [], (err: object, dbRes: SQL) => {
        if(err) {
            res.send(`${err}`);
        } else {
            dbRes.rowCount === 0
                ? res.send('Product not found')
                : res.send(dbRes.rows);
        }
    });
});

// TODO: Needs to require JWT
router.post('/products', (req: Request, res: Response): void => {
    const { name, price } = req.body;
    db.query(`INSERT INTO products (name, price) VALUES (\'${name}\', ${price})`, [], (err: object, dbRes: SQL) => {
        if(err) {
            res.send(`${err}`);
        } else {
            dbRes.rowCount === 1 
                ? res.send(`Sucessfully created ${name}`)
                : res.send(`Error creating ${name}`);
        }
    });
});


module.exports = router;