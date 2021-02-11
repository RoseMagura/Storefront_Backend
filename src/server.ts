import * as express from 'express';
import { Request, Response } from 'express';
import * as bodyParser from 'body-parser';
import * as bcrypt from 'bcrypt';
import { UserModel } from './models/UserModel';
import { SQL } from './interfaces/SQL';
import * as jwt from 'jsonwebtoken';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import productsRouter from './routes/products';
import usersRouter from './routes/users';
import ordersRouter from './routes/orders';
import { initDB } from './db/init';

export const app: express.Application = express();
const address = '0.0.0.0:3000';

app.use(bodyParser.json());
app.use(cookieParser());
const options = {
    origin: ['http://localhost:4200', 'http://localhost:3000'],
    exposedHeaders: ['Set-Cookie', 'Date'],
    credentials: true,
};
app.use(cors(options));

app.use(express.static('public'));

app.use('/products', productsRouter);
app.use('/users', usersRouter);
app.use('/orders', ordersRouter);

initDB();

app.get('/', (req: Request, res: Response): void => {
    res.send(JSON.stringify('Please Login.'));
});

app.post(
    '/',
    async (req: Request, res: Response): Promise<void> => {
        const jwtKey = process.env.JWTKEY;
        const { firstName, lastName, password } = req.body;
        const auth = await signIn(firstName, lastName, password).catch((err) =>
            console.error(err)
        );
        const token = jwt.sign({ lastName }, String(jwtKey), {
            algorithm: 'HS256',
            expiresIn: 600,
        });

        if (auth !== undefined && auth) {
            res.cookie('token', token, { maxAge: 600000, sameSite: 'strict' });
            res.send(
                JSON.stringify({
                    success: true,
                    message: `${firstName} ${lastName} successfully logged in!`,
                })
            );
        } else {
            if (auth === undefined) {
                res.send(
                    JSON.stringify({
                        success: false,
                        message: 'Unsuccessful login: incorrect name(s).',
                    })
                );
            } else {
                res.send(
                    JSON.stringify({
                        success: false,
                        message: 'Unsuccessful login: incorrect password.',
                    })
                );
            }
        }
    }
);

app.listen(3000, (): void => {
    console.log(`starting app on: ${address}`);
});

const signIn = async (
    firstName: string,
    lastName: string,
    password: string
): Promise<boolean> => {
    const userModel = new UserModel();

    const isSQL = (sql: any): sql is SQL => {
        return 'rows' in sql && 'rowCount' in sql;
    };

    const getUserSQL = async (
        firstName: string,
        lastName: string
    ): Promise<SQL | null> => {
        const dbRes = await userModel.getByName(firstName, lastName);
        if (dbRes && isSQL(dbRes)) {
            return dbRes;
        }
        return null;
    };
    const user = await getUserSQL(firstName, lastName);
    // The any here is consistent with the SQL interface,
    // which is necessary for flexibility (see SQL interface)
    const rows: any = user !== null && user.rows;
    const curUser = rows !== undefined && rows.pop();
    const hashedPassword = curUser.password;
    const authResult = await bcrypt.compare(password, hashedPassword);
    return authResult;
};
