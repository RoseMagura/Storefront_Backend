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

module.exports = router;