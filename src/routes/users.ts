import * as express from 'express';
import { Request, Response } from 'express';
import { UserModel } from '../models/UserModel';
import { SQL } from '../interfaces/SQL';
import { checkToken } from '../auth';

const router = express.Router();
const userModel = new UserModel();

// Any is necessary here to allow the function
// to process a wide variety of potential values
const isSQL = (sql: any): sql is SQL => {
    return 'rows' in sql && 'rowCount' in sql;
};

const getSQL = async (id: number): Promise<SQL | null> => {
    const dbRes = await userModel.getById(id);
    if (dbRes && isSQL(dbRes)) {
        return dbRes;
    }
    return null;
};

const getAllSQL = async (): Promise<SQL | null> => {
    const res = await userModel.getAll();
    if (res && isSQL(res)) {
        return res;
    }
    return null;
};

const postUserGetSQL = async (
    firstName: string,
    lastName: string,
    password: string
): Promise<SQL | null> => {
    const postRes = await userModel.create(firstName, lastName, password);
    if (postRes && isSQL(postRes)) {
        return postRes;
    }
    return null;
};

router.get(
    '',
    async (req: Request, res: Response): Promise<void> => {
        const tokenStatus = checkToken(req.cookies.token);
        const all = await getAllSQL();
        if (tokenStatus.code == 200) {
            try {
                res.send(all !== null && all.rows);
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
                const dbRes = await getSQL(id);
                if (dbRes !== null) {
                    dbRes.rowCount === 0
                        ? res.send('User not found')
                        : res.send(dbRes.rows);
                }
            } catch (error: unknown) {
                console.error(error);
                res.send(`Error: ${error}`);
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
                const dbRes = await postUserGetSQL(
                    firstName,
                    lastName,
                    password
                );
                dbRes !== null && dbRes.rowCount === 1
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

export default router;
