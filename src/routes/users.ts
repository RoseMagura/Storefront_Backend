import * as express from 'express';
import { Request, Response } from 'express';
import { UserModel } from '../models/UserModel';
import { SQL } from '../interfaces/SQL';
import { checkToken } from '../auth';
import { isSQL } from './products';


const router = express.Router();
const userModel = new UserModel();

const getSQL = async (id: number): Promise<SQL | null> => {
    const dbRes = await userModel.getById(id);
    if (dbRes && isSQL(dbRes)) {
        return dbRes;
    }
    return null;
};

router.get(
    '',
    async (req: Request, res: Response): Promise<void> => {
        const tokenStatus = checkToken(req.cookies.token);
        if (tokenStatus.code == 200) {
            try {
                res.send(await userModel.getAll());
            } catch (error: unknown) {
                res.send(error);
            }
        } else {
            res.status(tokenStatus.code);
            res.send(tokenStatus.message);
        }
    }
);

router.get(
    '/:id',
    async (req: Request, res: Response): Promise<void> => {
        const id = parseInt(req.params.id);
        const tokenStatus = checkToken(req.cookies.token);
        if (tokenStatus.code == 200) {
            try {
                // const dbRes: any = await userModel.getById(id);
                const dbRes = await getSQL(id);
                if (dbRes !== null) {
                    dbRes.rowCount === 0
                    ? res.send('User not found')
                    : res.send(dbRes.rows);
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

router.post(
    '',
    async (req: Request, res: Response): Promise<void> => {
        const { firstName, lastName, password } = req.body;
        const tokenStatus = checkToken(req.cookies.token);
        if (tokenStatus.code == 200) {
            try {
                const dbRes: any = await userModel.create(
                    firstName,
                    lastName,
                    password
                );
                dbRes.rowCount === 1
                    ? res.send(
                          `Successfully created User ${firstName} ${lastName}`
                      )
                    : res.send(`Error creating User ${firstName} ${lastName}`);
            } catch (error: unknown) {
                res.send(error);
            }
        } else {
            res.status(tokenStatus.code);
            res.send(tokenStatus.message);
        }
    }
);

module.exports = router;
