import * as express from 'express';
import { Request, Response } from 'express';
import * as bodyParser from 'body-parser';
import { initDB } from './db/init';

export const app: express.Application = express();
const address: string = '0.0.0.0:3000';

app.use(bodyParser.json());

app.use(express.static('public'));
app.use(require('./routes/products'));

// initDB();

app.get('/', function (req: Request, res: Response) {
    res.send('Ready for requests to backend.');
});

app.listen(3000, function () {
    console.log(`starting app on: ${address}`);
});