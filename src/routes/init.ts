import { Pool } from 'pg';

const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: parseInt(process.env.PGPORT)
});

pool.query('SELECT * FROM USERS', (err, res) => {
    console.log(err, res);
    pool.end();
});