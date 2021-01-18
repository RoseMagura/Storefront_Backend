import * as express from 'express';
import { Request, Response } from "express";
import db from '../db';

const router = express.Router();

interface SQL {
    rows: object
}

router.get('/products', (req: Request, res: Response): void => {
    db.query('SELECT * FROM PRODUCTS', [], (err: object, dbRes: SQL) => {
        if(err) {
            res.send(`Error ${err}`);
        }
        res.send(dbRes.rows);
    });
});

// TODO: Needs to require JWT
router.get('/products/:id', (req: Request, res: Response): void => {
    const id = req.params.id;
    db.query(`SELECT * FROM PRODUCTS WHERE product_id = ${id}`, [], (err: object, dbRes: SQL) => {
        if(err) {
            res.send(`${err}`);
        } else {
            res.send(dbRes.rows);
        }
    });
});

module.exports = router;