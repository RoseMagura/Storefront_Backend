import * as express from 'express';
import { Request, Response } from 'express';
import * as bodyParser from 'body-parser';
import { initDB } from './db/init';
import * as bcrypt from 'bcrypt';
import { UserModel } from './models/UserModel';
import { SQL } from './interfaces/SQL';
import * as jwt from 'jsonwebtoken';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import { User } from './interfaces/User';
import { query } from './db';
import * as http from 'http';

export const app: express.Application = express();
const address: string = '0.0.0.0:3000';

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({ origin: address }));

// initDB();

app.use(express.static('public'));

app.use('/products', require('./routes/products'));
app.use('/users', require('./routes/users'));
app.use('/orders', require('./routes/orders'));

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

const getRealUser = async () => {
    const users = await query('SELECT * FROM USERS;');
    if (users.rowCount === 0) {
        const userModel = new UserModel();
        await userModel.create('Customer', 'One', 'securePassword');
    }
    return users.rows[0];
};

app.listen(
    3000,
    async (): Promise<any> => {
        console.log(`starting app on: ${address}`);
    }
);

const signIn = async (
    firstName: string,
    lastName: string,
    password: string
): Promise<boolean> => {
    const userModel = new UserModel();
    const user: any = await userModel.getByName(firstName, lastName);
    const rows = user.rows;
    const curUser: User = rows.pop();
    const hashedPassword = curUser.password;
    return await bcrypt.compare(password, hashedPassword);
};
