import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import pg from 'pg';

const app: express.Application = express();
const address: string = '0.0.0.0:3000';
dotenv.config();

app.use(bodyParser.json());

app.get('/', function (req: Request, res: Response) {
    res.send('Hello World!');
});

app.listen(3000, function () {
    console.log(`starting app on: ${address}`);
});

const { Pool } = pg;
const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: parseInt(process.env.PGPORT)
});

pool.query('SELECT * FROM USERS', (err, res) => {
    if(err){
        console.log(err);
    }
    console.log(res.rows);
    pool.end();
});