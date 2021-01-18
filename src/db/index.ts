import * as pg from 'pg';
import * as dotenv from 'dotenv';

const { Pool } = pg;
dotenv.config();

const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: parseInt(process.env.PGPORT),
});

export default {
    query: (text: any, params: any[], callback: any) => {
        const start = Date.now();
        return pool.query(text, params, (err, res) => {
            const duration = Date.now() - start;
            console.log(`executed query`, {
                text,
                duration,
                rows: res.rowCount,
            });
            callback(err, res);
        });
    },
};
