import db from '../db';
import { SQL } from '../routes/products';

export const initDB = (): void => {
    // formatQuery('CREATE DATABASE store;');
    formatQuery(
        'DROP TABLE IF EXISTS products; \
        CREATE TABLE products ( \
            id INT GENERATED ALWAYS AS IDENTITY, \
            name VARCHAR(255) NOT NULL, \
            price DECIMAL);'
    );
};

const formatQuery = (statement: string): void => {
    db.query(statement, [], (err: object, dbRes: SQL) => {
        if (err) {
            console.log(`${err}`);
        }
        // dbRes !== undefined
        //     ? console.log(dbRes)
        //     : console.log('error');
    });
};
