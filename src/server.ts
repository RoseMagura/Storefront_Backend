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

export const app: express.Application = express();
const address = '0.0.0.0:3000';

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({ origin: address }));

app.use(express.static('public'));

app.use('/products', productsRouter);
app.use('/users', usersRouter);
app.use('/orders', ordersRouter);

app.get('/', (req: Request, res: Response): void => {
    res.send('Please Login.');
});

app.post('/', (req: Request, res: Response): void => {
    const jwtKey = process.env.JWTKEY;
    const { firstName, lastName, password } = req.body;
    const auth = signIn(firstName, lastName, password);
    const token = jwt.sign({ lastName }, String(jwtKey), {
        algorithm: 'HS256',
        expiresIn: 600,
    });

    if (auth) {
        res.cookie('token', token, { maxAge: 600000 });
        res.send(`${firstName} ${lastName} successfully logged in!`);
    } else {
        res.send('Unsuccessful login');
    }
});

app.listen(
    3000,
    async (): Promise<void> => {
        console.log(`starting app on: ${address}`);
    }
);

const signIn = async (
    firstName: string,
    lastName: string,
    password: string
): Promise<boolean> => {
    const userModel = new UserModel();
    // const user = await userModel.getByName(firstName, lastName);

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
    const authResult = await bcrypt.compare(
        password,
        hashedPassword,
        (err, res) => {
            if (err) {
                console.error(err);
            }
            return res;
        }
    );
    return authResult;
};
