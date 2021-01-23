import * as express from 'express';
import { Request, Response } from "express";
import { UserModel } from '../models/UserModel';
import { SQL } from '../interfaces/SQL';
import { checkToken } from '../auth';

const router = express.Router();
const userModel = new UserModel();

router.get('', async (req: Request, res: Response): Promise<void> => {
    const tokenStatus = checkToken(req.cookies.token);
    if(tokenStatus == 'Success') {
        try {
            res.send(await userModel.getAll());
        } catch (error: unknown) {
            res.send(error);
        }
    } else{
        res.send(tokenStatus);
    }
});

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    const tokenStatus = checkToken(req.cookies.token);
    if(tokenStatus == 'Success') {
        try {
            const dbRes: any = await userModel.getById(id);
            dbRes.rowCount === 0
                ? res.send('User not found')
                : res.send(dbRes.rows);
        } catch (error: unknown) {
            res.send(error);
        }
    } else{
        res.send(tokenStatus);
    }
});

router.post('', async (req: Request, res: Response): Promise<void> => {
    const { firstName, lastName, password } = req.body;
    const tokenStatus = checkToken(req.cookies.token);
    if(tokenStatus == 'Success') {
        try {
            const dbRes: any = await userModel.create(firstName, lastName, password);
            dbRes.rowCount === 1 
                ? res.send(`Sucessfully created User ${firstName} ${lastName}`)
                : res.send(`Error creating User ${firstName} ${lastName}`);
        } catch (error: unknown) {
            res.send(error);
        }} else {
            res.send(tokenStatus);
        }
});

module.exports = router;