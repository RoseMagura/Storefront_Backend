import * as express from 'express';
import { Request, Response } from 'express';
import * as bodyParser from 'body-parser';
import { initDB } from './db/init';
import * as bcrypt from 'bcrypt';
import { UserModel } from './models/UserModel';
import { SQL } from './routes/products';
import * as jwt from 'jsonwebtoken';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';

export const app: express.Application = express();
const address: string = '0.0.0.0:3000';

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({origin: address}));

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
    const token = jwt.sign({ lastName }, jwtKey, {
        algorithm: "HS256",
        expiresIn: 600
    });

    if(auth){
        res.cookie('token', token, {maxAge: 600000});
        res.send(`${firstName} ${lastName} successfully logged in!`);
    } else {
        res.send('Unsuccessful login');
    }
});

app.listen(3000, async (): Promise<void> => {
    console.log(`starting app on: ${address}`);
});

const signIn = async (firstName: string, lastName: string, password: string): Promise<boolean> => {
    const userModel = new UserModel();
    const user: SQL = await userModel.getByName(firstName, lastName);
    const hashedPassword = user.rows[0]['password'];
    return await bcrypt.compare(password, hashedPassword);
}