import * as pg from 'pg';
import * as dotenv from 'dotenv';

const { Pool } = pg;
dotenv.config();

const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: Number(process.env.PGPORT),
});

const testPool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGTESTDATABASE,
    password: process.env.PGPASSWORD,
    port: Number(process.env.PGPORT),
});

// This function could return either a response
// from the database, or an error, so it needs
// to use any
export const query = (statement: string): any => {
    try {
        return pool.query(statement);
    } catch (error: unknown) {
        console.log(error);
    }
};

export const testQuery = (statement: string): any => {
    try {
        return testPool.query(statement);
    } catch (error: unknown) {
        console.log(error);
    }
};
