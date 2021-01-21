import * as express from 'express';
import { Request, Response } from "express";
import { UserModel } from '../models/UserModel';
import { SQL } from './products';

const router = express.Router();
const userModel = new UserModel();

// TODO: Needs to require JWT
router.get('', async (req: Request, res: Response): Promise<void> => {
    try {
        res.send(await userModel.getAll());
    } catch (error: unknown) {
        res.send(error);
    }
});

// TODO: Needs to require JWT
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    try {
        const dbRes: SQL = await userModel.getById(id);
        dbRes.rowCount === 0
            ? res.send('User not found')
            : res.send(dbRes.rows);
    } catch (error: unknown) {
        res.send(error);
    }
});

// TODO: Needs to require JWT
router.post('', async (req: Request, res: Response): Promise<void> => {
    const { firstName, lastName, password } = req.body;
    const dbRes: SQL = await userModel.create(firstName, lastName, password);
    dbRes.rowCount === 1 
        ? res.send(`Sucessfully created User ${firstName} ${lastName}`)
        : res.send(`Error creating User ${firstName} ${lastName}`);
});


module.exports = router;