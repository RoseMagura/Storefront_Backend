import * as express from 'express';
import { Request, Response } from "express";
import { connectToDB } from '../db/init';
import { Sequelize } from 'sequelize';
import * as ProductModel from '../models/product';

const router = express.Router();

// TODO: ADD PRICE COLUMN FOR PRODUCTS
router.get('/products', async (req: Request, res: Response): Promise<void> => {
    const seq = await connectToDB();
    const Product = ProductModel(seq, Sequelize);
    res.send(await Product.findAll());
});

router.get('/products/:id', async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    const seq = await connectToDB();
    const Product = ProductModel(seq, Sequelize);
    res.send(await Product.findByPk(id));
});

// TODO: Needs to require JWT
router.post('/products', async (req: Request, res: Response): Promise<void> => {
    const { name, price } = req.body;
    const seq = await connectToDB();
    const Product = ProductModel(seq, Sequelize);
    res.send(await Product.create({ name, price}));
});

module.exports = router;